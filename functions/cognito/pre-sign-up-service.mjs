import { AdminLinkProviderForUserCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

export class PreSignUpService {
    constructor(cognitoIdentityProviderClient) {
        this.cognitoIdentityProviderClient = cognitoIdentityProviderClient;
    }

    async handle(event) {
        var listUsersCommandRequest = {
            UserPoolId: event.userPoolId,
            AttributesToGet: ['sub', 'email'],
            Filter: "email = \"" + event.request.userAttributes.email + "\""
        }

        const listUsersCommandResponse = await this.cognitoIdentityProviderClient.send(new ListUsersCommand(listUsersCommandRequest));

        if (listUsersCommandResponse.Users.length == 1 && event.triggerSource.includes('ExternalProvider')) {
            const providerAttributeValue = event.userName.split("_")[1];
            const adminLinkProviderForUserRequest = {
                DestinationUser: {
                    ProviderAttributeValue: listUsersCommandResponse.Users[0].Username,
                    ProviderName: 'Cognito'
                },
                SourceUser: {
                    ProviderAttributeName: 'Cognito_Subject',
                    ProviderAttributeValue: providerAttributeValue,
                    ProviderName: "Google"
                },
                UserPoolId: event.userPoolId
            };

            await this.cognitoIdentityProviderClient.send(new AdminLinkProviderForUserCommand(adminLinkProviderForUserRequest))
                .catch((error) => {
                    console.error("Linking failed for user with email \"" + event.request.userAttributes.email + "\"");
                    throw error;
                })
        } else if (listUsersCommandResponse.Users.length >= 1) {
            throw new Error(`An account with email ${event.request.userAttributes.email} already exists`);
        }

        return event;
    }
}