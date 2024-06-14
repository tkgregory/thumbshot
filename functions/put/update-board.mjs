'use strict'

import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb"
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

export const handler = async (event) => {
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id
    const userId = event.requestContext.authorizer.jwt.claims.sub
    const name = body.name
    const previews = body.previews

    if (!id || !name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid request body" }),
            headers: {
                "content-type": "application/json"
            }
        }
    }

    let updateExpression = "SET #boardName = :name, updated = :updated";
    let expressionAttributeValues = {
        ":userId": userId,
        ":name": name,
        ":updated": new Date().toISOString(),
    };

    if (previews) {
        expressionAttributeValues[":previews"] = previews
        updateExpression = `${updateExpression}, previews = :previews`;
    }

    const updateJSON = {
        TableName: process.env.BOARDS_TABLE_NAME,
        Key: {
            id: id
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: { "#boardName": "name" },
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