const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, ScanCommand} = require("@aws-sdk/lib-dynamodb");
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = 'n10937668-VideosTable';

// Fetch all videos from db
exports.getVideos = async (req, res, next) => {
    try {
        const params = {
            TableName: TABLE_NAME,
        };
        const videos = await docClient.send(new ScanCommand(params));
        res.json(videos.Items);
    } catch (err) {
        console.error('Error fetching videos:', err);
        next(err);
    }
};
