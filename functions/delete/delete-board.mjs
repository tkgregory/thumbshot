'use strict'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const id = event.pathParameters.id
    const userId = event.requestContext.authorizer.jwt.claims.sub

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing path parameter 'id'" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    const deleteJSON = {
        TableName: process.env.BOARDS_TABLE_NAME,
        Key: {
            id: id,
        },
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    }

    try {
        await docClient.send(new DeleteCommand(deleteJSON));
    } catch (error) {
        console.error("Error deleting board with delete command: " + JSON.stringify(deleteJSON, null, 2))
        throw error
    }

    return {
        statusCode: 204
    }
}