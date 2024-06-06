'use strict'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

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

    const getJSON = {
        TableName: process.env.BOARDS_TABLE_NAME,
        Key: {
            id: id,
        },
        ConditionExpression: "attribute_exists(id) AND userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId,
        },
    }
    const response = await docClient.send(new GetCommand(getJSON));

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(response.Item)
    }
}