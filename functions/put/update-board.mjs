'use strict'

import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb"
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id
    const userId = event.requestContext.authorizer.jwt.claims.sub
    const previews = body.previews

    if (!id || !previews) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    const updateJSON = {
        TableName: process.env.BOARDS_TABLE_NAME,
        Key: {
            id: id
        },
        UpdateExpression: "SET previews = :previews",
        ExpressionAttributeValues: {
            ":previews": previews,
            ":userId": userId,
        },
        ConditionExpression: "attribute_exists(id) AND userId = :userId",
        ReturnValues: ReturnValue.ALL_NEW
    }
    const response = await docClient.send(new UpdateCommand(updateJSON));
    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(response.Attributes)
    }
}