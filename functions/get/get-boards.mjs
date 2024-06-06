'use strict'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const userId = event.requestContext.authorizer.jwt.claims.sub

    const queryJSON = {
        TableName: process.env.BOARDS_TABLE_NAME,
        IndexName: "userIdIndex",
        KeyConditionExpression: "userId = :userId",
        ProjectionExpression: "id, userId, #boardName",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
        ExpressionAttributeNames: { "#boardName": "name" }
    }
    const response = await docClient.send(new QueryCommand(queryJSON));

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(response.Items)
    }
}