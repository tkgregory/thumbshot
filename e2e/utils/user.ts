import { exec } from 'child_process';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

export async function cleanUpAutomatedTestUser() {
    await deleteUserBoards('14e8a408-7011-7068-7ea6-025e2a10baf0') // t.k.gregory+automatedtestuser@gmail.com
}

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

    while (ids.length > 0) {
        const batchSize = Math.min(25, ids.length)
        const deleteRequests = [] as Record<string, any>[]

        for (let i = 0; i < batchSize; i++) {
            deleteRequests.push(
                {
                    DeleteRequest: {
                        Key: {
                            id: ids.shift()
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
            throw err;
        }
    }
}