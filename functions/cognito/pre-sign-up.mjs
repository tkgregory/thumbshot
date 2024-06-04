'use strict';

import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { PreSignUpService } from "./pre-sign-up-service.mjs"

const cognitoIdentityProviderClient = new CognitoIdentityProviderClient()
const preSignUpService = new PreSignUpService(cognitoIdentityProviderClient)

export const handler = async (event) => {
    return preSignUpService.handle(event)
};