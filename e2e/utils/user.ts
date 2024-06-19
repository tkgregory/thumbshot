import { exec } from 'child_process';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

export async function deleteUserBoards(userId: string) {
    const dynamoDbQueryCommand = `aws dynamodb query --table-name dev-boards --index userIdSortByNameIndex --key-condition-expression \"userId = :userId\" --expression-attribute-values \"{\\\":userId\\\":{\\\"S\\\":\\\"${userId}\\\"}}\" --select SPECIFIC_ATTRIBUTES --projection-expression \"id\" --query \"Items[*].id.S\" --region us-east-1`
    const ids = JSON.parse(await new Promise<string>((resolve, reject) => {
        exec(dynamoDbQueryCommand, (err, stdout) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                resolve(stdout);
            }
        });
    }));

    if (ids.length === 0) {
        return
    }

    const client = new DynamoDBClient({ region: 'us-east-1' });
    const docClient = DynamoDBDocumentClient.from(client)

    const deleteRequests = [] as Record<string, any>[]
    for (const id of ids) {
        deleteRequests.push(
            {
                DeleteRequest: {
                    Key: {
                        id: id
                    }
                }
            })
    }

    const command = new BatchWriteCommand({
        RequestItems: {
            'dev-boards': deleteRequests
        }
    });

    try {
        await docClient.send(command);
    } catch (err) {
        console.log(err);
    }
}