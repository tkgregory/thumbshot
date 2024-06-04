import { PreSignUpService } from "../functions/cognito/pre-sign-up-service.mjs"
import { jest } from '@jest/globals'

describe('Handles new user', () => {
    afterEach(() => {
        delete global.foo
    });

    it('Throws error when user exists but new user not from external provider', async () => {
        const cognitoIdentityProviderClientSpy = jest.fn().mockResolvedValueOnce({ Users: [{}] });
        const cognitoIdentityProviderClient = {
            send: cognitoIdentityProviderClientSpy,
        }

        const event = {
            request: {
                userAttributes: {
                    email: "some@body.com"
                }
            },
            response: {},
            triggerSource: "PreSignUp_SignUp",
            userPoolId: "user-pool-id",
        };
        const preSignUpService = new PreSignUpService(cognitoIdentityProviderClient);
        await expect(preSignUpService.handle(event)).rejects.toThrow("An account with email some@body.com already exists");

        expect(cognitoIdentityProviderClientSpy).toHaveBeenCalledWith(expect.objectContaining({
            "input": {
                "UserPoolId": "user-pool-id",
                "AttributesToGet": ['sub', 'email'],
                "Filter": "email = \"some@body.com\""
            }
        }));
    });

    it('Links user if user exists and new user if from external provider', async () => {
        const cognitoIdentityProviderClientSpy = jest.fn()
            .mockResolvedValueOnce({
                Users: [{
                    Username: "aaa-aaa-aaa-aaa-aaa"
                }]
            })
            .mockResolvedValueOnce(true);;
        const cognitoIdentityProviderClient = {
            send: cognitoIdentityProviderClientSpy,
        }

        const event = {
            request: {
                userAttributes: {
                    email: "some@body.com"
                }
            },
            response: {},
            triggerSource: "PreSignUp_ExternalProvider",
            userPoolId: "user-pool-id",
            userName: "Google_12345"
        };
        const preSignUpService = new PreSignUpService(cognitoIdentityProviderClient);
        await preSignUpService.handle(event);

        expect(cognitoIdentityProviderClientSpy).toHaveBeenCalledWith(expect.objectContaining({
            "input": {
                "UserPoolId": "user-pool-id",
                "AttributesToGet": ['sub', 'email'],
                "Filter": "email = \"some@body.com\""
            }
        }));
        expect(cognitoIdentityProviderClientSpy).toHaveBeenCalledWith(expect.objectContaining({
            "input": {
                "DestinationUser": {
                    "ProviderAttributeValue": "aaa-aaa-aaa-aaa-aaa",
                    "ProviderName": "Cognito"
                },
                "SourceUser": {
                    "ProviderAttributeName": "Cognito_Subject",
                    "ProviderAttributeValue": "12345",
                    "ProviderName": "Google"
                },
                "UserPoolId": "user-pool-id",
            }
        }));
    });

    it('Logs email if linking user from external provider fails', async () => {
        const logSpy = jest.spyOn(console, 'error');
        const cognitoIdentityProviderClientSpy = jest.fn()
            .mockResolvedValueOnce({
                Users: [{
                    Username: "aaa-aaa-aaa-aaa-aaa"
                }]
            })
            .mockRejectedValueOnce("error from AWS")
        const cognitoIdentityProviderClient = {
            send: cognitoIdentityProviderClientSpy,
        }

        const event = {
            request: {
                userAttributes: {
                    email: "some@body.com"
                }
            },
            response: {},
            triggerSource: "PreSignUp_ExternalProvider",
            userPoolId: "user-pool-id",
            userName: "Google_12345"
        };
        const preSignUpService = new PreSignUpService(cognitoIdentityProviderClient);
        await expect(preSignUpService.handle(event)).rejects.toEqual("error from AWS");

        expect(logSpy).toHaveBeenCalledWith('Linking failed for user with email "some@body.com"');
    });
});