'use strict'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const userId = event.requestContext.authorizer.jwt.claims.sub

    const command = new GetCommand({
        TableName: process.env.USERS_TABLE_NAME,
        Key: {
            'id': userId
        }
    })

    const userRecord = await docClient.send(command)
    if (!userRecord.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "User record not found" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    const responseBody = {
        id: userRecord.Item.id,
        previews: userRecord.Item.previews ? Array.from(userRecord.Item.previews) : [],
    }

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
        headers: {
            "content-type": "application/json"
        }
    }
}