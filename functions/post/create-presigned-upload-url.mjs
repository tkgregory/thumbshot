import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
    const client = new S3Client({ region });
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command);
};

export const handler = async (event) => {
    const body = JSON.parse(event.body)

    const objectKey = `${uuid()}.${body.fileExtension}`
    const presignedUrl = await createPresignedUrlWithClient({
        bucket: process.env.BUCKET_NAME,
        key: objectKey
    });

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presignedUploadURL: presignedUrl, objectKey: objectKey }),
    };
};