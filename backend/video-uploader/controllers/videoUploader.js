
const { PutCommand, UpdateCommand, ScanCommand, DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = 'n10937668-VideosTable';

// Generating a pre-signed URL for uploading video
exports.generateUploadUrl = async (req, res) => {
    const { title } = req.body;
    const videoId = Date.now().toString(); //random


    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${videoId}-${title}`,
        ContentType: 'video/*',
        ACL: 'private',
    };

    try {
        const signedUrl = await getSignedUrl(s3Client, new PutObjectCommand(uploadParams), { expiresIn: 3600 });

        const videoItem = {
            id: videoId,
            'qut-username': 'n10937668@qut.edu.au',
            name: title,
            status: 'pending', //when uploading
            createdAt: new Date().toISOString(),
        };
        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: videoItem }));

        return res.json({ signedUrl, videoId });
    } catch (err) {
        console.error('Error generating signed URL:', err);
        return res.status(500).json({ error: 'Failed to generate upload URL' });
    }
};
