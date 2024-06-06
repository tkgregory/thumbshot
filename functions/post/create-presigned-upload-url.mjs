import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const createPresignedUrlWithClient = ({ region, bucket, key }) => {
    const client = new S3Client({ region });
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command);
};

export const handler = async () => {
    const presignedUrl = await createPresignedUrlWithClient({
        bucket: process.env.BUCKET_NAME,
        key: "example.jpg",
    });

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "presignedUploadURL": presignedUrl }),
    };
};