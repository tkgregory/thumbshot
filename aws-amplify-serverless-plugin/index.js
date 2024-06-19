// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const chalk = require('chalk');
const stringify = require('json-stable-stringify-pretty');
const {
    name,
    version
} = require('./package.json');

class ServerlessAmplifyPlugin {
    constructor(serverless, options) {
        this.useragent = `${name}/${version}`;
        this.serverless = serverless;
        this.options = options;

        this.provider = this.serverless.getProvider('aws');
        this.stage = this.provider.getStage();
        this.config = this.serverless.service.custom.amplify || [];

        this.hooks = {
            'after:deploy:deploy': this.process.bind(this)
        };
    }

    stackName() {
        return this.provider.naming.getStackName();
    }

    /**
     * Log a message to the console.
     */
    log(level, message) {
        if (level == 'error') {
            console.log(chalk.red(`ERROR: amplify-plugin: ${message}`));
        } else if (level == 'warn') {
            console.log(chalk.yellow(`WARNING: amplify-plugin: ${message}`));
        } else if (level == 'info') {
            if (this.options.v) console.log(chalk.green('amplify-plugin: ') + message);
        } else {
            if (process.env.SLS_DEBUG) console.log(chalk.blue('amplify-plugin: ') + message);
        }
    }

    /**
     * Calls the AWS Control Plane API to retrieve information
     *
     * @param {String} apiName
     * @param {String} operation
     * @param {Object} parameters
     */
    async fetch(apiName, operation, parameters) {
        this.log('debug', `fetch(${apiName}, ${operation}, ${JSON.stringify(parameters)})`);
        return this.provider.request(apiName, operation, parameters);
    }

    /**
     * Process the after:deploy:deploy hook to generate the files.  Because the
     * process() has to be synchronous, yet many of the methods are async, we
     * transition to a Promise based structure.  However, most of the methods
     * use async/await to properly process things linearly.
     */
    process() {
        this.log('info', `Processing stack: ${this.stackName()}`);
        const resources = this.listStackResources(this.stackName())
            .then(resources => this.describeStackResources(resources))
            .then(resources => this.writeConfigurationFiles(resources))
            .catch(error => this.log('error', `Cannot load resources: ${error.message}`));
        return resources;
    }

    /**
     * Obtains the resources for a specific CloudFormation stack
     *
     * @param {String} stackName the name of the CloudFormation stack
     * @returns {Resource[]} list of resource objects
     */
    async listStackResources(stackName) {
        let resources = [];
        let request = { StackName: stackName };
        let morePages = false;

        do {
            let result = await this.fetch('CloudFormation', 'listStackResources', request);
            result.StackResourceSummaries.forEach(item => { resources.push(item); });
            request.NextToken = result.NextToken;
            morePages = result.NextToken ? true : false;
        } while (morePages);

        for (let resource of resources) {
            if (resource.ResourceType === 'AWS::CloudFormation::Stack') {
                const nestedStackName = resource.PhysicalResourceId.split('/')[1];
                this.log('info', `Processing nested stack: ${nestedStackName}`);
                const nestedResources = await this.listStackResources(nestedStackName);
                resources.push(...nestedResources);
            }
        }

        return resources;
    }

    /**
     * Gets the specifics of the actual physical resource ID based on the Resource Type
     *
     * @param {Resource[]} resources the list of resources to describe
     * @returns {Resource[]} the resource with added descriptions.
     */
    async describeStackResources(resources) {
        let detailedResources = [];
        for (let i = 0 ; i < resources.length ; i++) {
            const resource = resources[i];
            switch (resource.ResourceType) {
                case 'AWS::Cognito::IdentityPool':
                    this.log('debug', `Processing ${JSON.stringify(resource)}`);
                    let idpMetadata = await this.fetch('CognitoIdentity', 'describeIdentityPool', { IdentityPoolId: resource.PhysicalResourceId });
                    detailedResources.push(Object.assign({}, resource, { metadata: idpMetadata }));
                    break;
                case 'AWS::Cognito::UserPool':
                    this.log('debug', `Processing ${JSON.stringify(resource)}`);
                    const userPoolMetaData = await this.fetch('CognitoIdentityServiceProvider', 'describeUserPool', { UserPoolId: resource.PhysicalResourceId });
                    detailedResources.push(Object.assign({}, resource, { metadata: userPoolMetaData }));
                    break;
                case 'AWS::S3::Bucket':
                    this.log('debug', `Processing ${JSON.stringify(resource)}`);
                    detailedResources.push(resource);   // We have all the details we need for this
                    break;
                case 'AWS::ApiGateway::RestApi':
                    this.log('debug', `Processing ${JSON.stringify(resource)}`);
                    detailedResources.push(resource);
                    break;
                default:
                    this.log('debug', `Skipping ${JSON.stringify(resource)}`);
                    break;
            }
        }

        // Process User pool clients AFTER the user pool
        for (let i = 0 ; i < resources.length ; i++) {
            const resource = resources[i];
            switch (resource.ResourceType) {
                case 'AWS::Cognito::UserPoolClient':
                    this.log('debug', `Processing ${JSON.stringify(resource)}`);
                    const cfTemplate =  this.serverless.service.provider.compiledCloudFormationTemplate.Resources[resource.LogicalResourceId];
                    const userPoolName = cfTemplate.Properties.UserPoolId.Ref;
                    const userPoolResource = resources.filter(r => r.ResourceType === 'AWS::Cognito::UserPool' && r.LogicalResourceId === userPoolName)[0];
                    let result = await this.fetch('CognitoIdentityServiceProvider', 'describeUserPoolClient', {
                        ClientId: resource.PhysicalResourceId,
                        UserPoolId: userPoolResource.PhysicalResourceId
                    });
                    detailedResources.push(Object.assign({}, resource, { metadata: result }));
                    break;
            }
        }

        return detailedResources;
    }

    /**
     * Writes out the required configuration files.
     *
     * @param {Resource][]} resources the fully processed resources with all available data
     */
    writeConfigurationFiles(resources) {
        for (let i = 0 ; i < this.config.length ; i++) {
            const fileDetails = this.config[i];
            if (fileDetails.hasOwnProperty('type') && fileDetails.hasOwnProperty('filename')) {
                switch (fileDetails.type.toLowerCase()) {
                    case 'native':
                        this.log('info', `Writing ${fileDetails.type} file to ${fileDetails.filename}`);
                        this.writeNativeConfiguration(resources, fileDetails);
                        break;
                    case 'javascript':
                        this.log('info', `Writing ${fileDetails.type} file to ${fileDetails.filename}`);
                        this.writeJavaScriptConfiguration(resources, fileDetails);
                        break;
                    default:
                        this.log('error', `Invalid Amplify configuration type directive for ${JSON.stringify(fileDetails)}`);
                        throw new Error(`Invalid Amplify configuration type directive for ${JSON.stringify(fileDetails)}`);
                }
            } else {
                this.log('error', `Invalid Amplify configuration directive for ${JSON.stringify(fileDetails)}`);
                throw new Error(`Invalid Amplify configuration directive for ${JSON.stringify(fileDetails)}`);
            }
        }
    }

    /**
     * Writes out a native 'awsconfiguration.json' file
     *
     * @param {Resource[]} resources the resources with meta-data
     * @param {FileDetails} fileDetails the file details
     */
    writeNativeConfiguration(resources, fileDetails) {
        let config = {
            'UserAgent': this.useragent,
            'Version': '1.0'
        };

        if (fileDetails.hasOwnProperty('appClient')) {
            const appClient = resources.find(r => r.ResourceType === 'AWS::Cognito::UserPoolClient' && r.LogicalResourceId === fileDetails.appClient);
            if (typeof appClient !== 'undefined') {
                config.CognitoUserPool = {
                    Default: {
                        PoolId: appClient.metadata.UserPoolClient.UserPoolId,
                        Region: appClient.metadata.UserPoolClient.UserPoolId.split('_')[0],
                        AppClientId: appClient.metadata.UserPoolClient.ClientId
                    }
                };
                if (appClient.metadata.UserPoolClient.hasOwnProperty('ClientSecret')) {
                    config.CognitoUserPool.Default.AppClientSecret = appClient.metadata.UserPoolClient.ClientSecret
                }
            } else {
                throw new Error(`Invalid appClient specified: ${fileDetails.appClient}`);
            }
        }

        const identityPools = resources.filter(r => r.ResourceType === 'AWS::Cognito::IdentityPool');
        const identityPoolForUserPool = fileDetails.hasOwnProperty('appClient')
            ? identityPools.find(r => r.metadata.CognitoIdentityProviders &&
                r.metadata.CognitoIdentityProviders.some(({ClientId}) => ClientId === config.CognitoUserPool.Default.AppClientId)
            )
            : undefined;
        const identityPool = identityPoolForUserPool || identityPools[0];
        if (typeof identityPool !== 'undefined') {
            config.CredentialsProvider = {
                CognitoIdentity: {
                    Default: {
                        Region: identityPool.PhysicalResourceId.split(':')[0],
                        PoolId: identityPool.PhysicalResourceId
                    }
                }
            };

            if (typeof identityPool.metadata.SupportedLoginProviders == 'object') {
                const providers = identityPool.metadata.SupportedLoginProviders;

                // Each authentication provider that is supported for federation  has an entry in
                // the SupportedLoginProviders that is a "magic" domain - constant for each provider.
                // Once you know the provider domain, you can easily add new provider support.
                if ('accounts.google.com' in providers) {
                    config.GoogleSignin = {
                        Permissions: 'email,profile,openid',
                        'ClientId-WebApp': providers['accounts.google.com']
                    };
                }

                if ('graph.facebook.com' in providers) {
                    config.FacebookSignin = {
                        Permissions: "public_profile",
                        AppId: providers['graph.facebook.com']
                    };
                }

                if ('www.amazon.com' in providers) {
                    config.AmazonSignin = {
                        Permissions: "profile",
                        ClientId: providers['www.amazon.com']
                    };
                }
            }
        }

        let s3buckets = resources.filter(r => r.ResourceType === 'AWS::S3::Bucket' && r.LogicalResourceId !== 'ServerlessDeploymentBucket');
        if (s3buckets.length > 0) {
            let userFiles = fileDetails.hasOwnProperty('s3bucket') ? s3buckets.find(r => r.LogicalResourceId === fileDetails.s3bucket) : s3buckets[0];
            if (typeof userFiles !== 'undefined') {
                config.S3TransferUtility = {
                    Default: {
                        Bucket: userFiles.PhysicalResourceId,
                        Region: this.provider.getRegion()
                    }
                };
            }
        }

        let apigw = resources.filter(r => r.ResourceType === 'AWS::ApiGateway::RestApi');
        if (apigw.length > 0) {
            let apiRecords = {};
            apigw.forEach((v) => {
                apiRecords[v.LogicalResourceId] = {
                    Endpoint: `https://${v.PhysicalResourceId}.execute-api.${this.provider.getRegion()}.amazonaws.com/${this.provider.getStage()}`,
                    Region: this.provider.getRegion()
                };
            });
            config.APIGateway = apiRecords;
        }

        this.writeConfigurationFile(fileDetails.filename, JSON.stringify(config, null, 2));
    }

    /**
     * Generates the list of appropriate resource definitions for a JavaScript
     * application.
     *
     * @param {Resource[]} resources the resources with meta-data
     * @param {FileDetails} fileDetails the file details
     */
    getJavaScriptConfiguration(resources, fileDetails) {
        let config = {};
        config.aws_project_region = this.provider.getRegion();

        if (fileDetails.hasOwnProperty('appClient')) {
            const appClient = resources.find(r => r.ResourceType === 'AWS::Cognito::UserPoolClient' && r.LogicalResourceId === fileDetails.appClient);
            if (typeof appClient !== 'undefined') {
                config.aws_cognito_region = appClient.metadata.UserPoolClient.UserPoolId.split('_')[0];
                config.aws_user_pools_id = appClient.metadata.UserPoolClient.UserPoolId;
                config.aws_user_pools_web_client_id = appClient.metadata.UserPoolClient.ClientId;
                config.aws_cognito_username_attributes = ["EMAIL"]
                config.aws_cognito_signup_attributes = ["EMAIL"]
                config.aws_cognito_verification_mechanisms = ["EMAIL"]
                config.oauth = {
                    domain: fileDetails.oauthDomain,
                    scope: [
                        'openid',
                        'email',
                        'profile'
                    ],
                    redirectSignIn: fileDetails.redirectSignIn,
                    redirectSignOut: fileDetails.redirectSignOut,
                    responseType: 'code'
                }
                config.aws_cognito_social_providers = ["GOOGLE"]
                config.aws_cognito_password_protection_settings = {
                    "passwordPolicyMinLength": 8,
                    "passwordPolicyCharacters": []
                }
                config.aws_cognito_mfa_configuration = "OFF"

                if (appClient.metadata.UserPoolClient.hasOwnProperty('ClientSecret')) {
                    config.aws_user_pools_web_client_secret = appClient.metadata.UserPoolClient.ClientSecret;
                }
            } else {
                throw new Error(`Invalid appClient specified: ${fileDetails.appClient}`);
            }
        }

        const identityPools = resources.filter(r => r.ResourceType === 'AWS::Cognito::IdentityPool');
        const identityPoolForUserPool = fileDetails.hasOwnProperty('appClient')
            ? identityPools.find(r => r.metadata.CognitoIdentityProviders &&
                r.metadata.CognitoIdentityProviders.some(({ClientId}) => ClientId === config.aws_user_pools_web_client_id)
            )
            : undefined;
        const identityPool = identityPoolForUserPool || identityPools[0];
        if (typeof identityPool !== 'undefined') {
            if (!config.hasOwnProperty("aws_cognito_region")) {
                config.aws_cognito_region = identityPool.PhysicalResourceId.split(':')[0];
            }
            config.aws_cognito_identity_pool_id = identityPool.PhysicalResourceId;

            if (typeof identityPool.metadata.SupportedLoginProviders == 'object') {
                const providers = identityPool.metadata.SupportedLoginProviders;
                const federated = {};
                let hasFederated = false;

                // Each authentication provider that is supported for federation  has an entry in
                // the SupportedLoginProviders that is a "magic" domain - constant for each provider.
                // Once you know the provider domain, you can easily add new provider support.
                if ('accounts.google.com' in providers) {
                    federated.google_client_id = providers['accounts.google.com'];
                    hasFederated = true;
                }

                if ('graph.facebook.com' in providers) {
                    federated.facebook_app_id = providers['graph.facebook.com'];
                    hasFederated = true;
                }

                if ('www.amazon.com' in providers) {
                    federated.amazon_client_id = providers['www.amazon.com'];
                    hasFederated = true;
                }

                if (hasFederated) {
                    config.federated = federated;
                }
            }
        }

        let s3buckets = resources.filter(r => r.ResourceType === 'AWS::S3::Bucket' && r.LogicalResourceId !== 'ServerlessDeploymentBucket');
        if (s3buckets.length > 0) {
            let userFiles = fileDetails.hasOwnProperty('s3bucket') ? s3buckets.find(r => r.LogicalResourceId === fileDetails.s3bucket) : s3buckets[0];
            if (typeof userFiles !== 'undefined') {
                config.aws_user_files_s3_bucket = userFiles.PhysicalResourceId;
                config.aws_user_files_s3_bucket_region = this.provider.getRegion();
            }
        }

        let apigw = resources.filter(r => r.ResourceType === 'AWS::ApiGateway::RestApi');
        if (apigw.length > 0) {
            let apiRecords = [];
            apigw.forEach((v) => {
                apiRecords.push({
                    endpoint: `https://${v.PhysicalResourceId}.execute-api.${this.provider.getRegion()}.amazonaws.com/${this.provider.getStage()}`,
                    name: v.LogicalResourceId,
                    region: this.provider.getRegion()
                });
            });
            config.aws_cloud_logic_custom = apiRecords;
        }

        return config;
    }

    /**
     * Writes out a JavaScript 'aws-exports.js' file
     *
     * @param {Resource[]} resources the resources with meta-data
     * @param {FileDetails} fileDetails the file details
     */
    writeJavaScriptConfiguration(resources, fileDetails) {
        let config = this.getJavaScriptConfiguration(resources, fileDetails);
        let config_header = [
            '// WARNING: DO NOT EDIT.  This file is automatically generated',
            `// Written by ${this.useragent} on ${new Date().toISOString()}`,
            ''
        ].join("\n");
        let config_body = `const awsmobile = ${stringify(config, { pretty: true, space: 4 })};`;
        let config_footer = "\nexport default awsmobile;\n"
        this.writeConfigurationFile(fileDetails.filename, [config_header, config_body, config_footer].join('\n'));
    }

    /**
     * Write a file to the filesystem
     *
     * @param {String} filename the file name to write to - any intermediary directories must exist
     * @param {String} contents the contents of the file
     */
    writeConfigurationFile(filename, contents) {
        fs.writeFile(filename, contents, 'utf8', (err, data) => {
            if (err) {
                this.log('error', `Writing to ${filename}: ${err}`);
            }
        });
    }
}

module.exports = ServerlessAmplifyPlugin;
