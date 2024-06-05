'use strict'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const body = JSON.parse(event.body)
    if (!body.previews) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    const putJSON = {
        TableName: process.env.USERS_TABLE_NAME,
        Item: {
            'id': event.requestContext.authorizer.jwt.claims.sub,
            'previews': body.previews,
        }
    }
    await docClient.send(new PutCommand(putJSON));

    return {
        statusCode: 204,
    }
}