'use strict'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { v4 as uuid } from "uuid";

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const body = JSON.parse(event.body)
    if (!body.previews || !body.name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    const board = {
        'id': uuid(),
        'userId': event.requestContext.authorizer.jwt.claims.sub,
        'name': body.name,
        'previews': body.previews,
    }
    const putJSON = {
        TableName: process.env.BOARDS_TABLE_NAME,
        Item: board
    }
    await docClient.send(new PutCommand(putJSON));

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(board)
    }
}