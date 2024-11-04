// sqsPoller.js
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const { processVideoData } = require('./videoTranscoder'); // Import processVideo function
const {  UpdateCommand, QueryCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../models/dynamoDBClient');

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

const TABLE_NAME = 'n10937668-VideosTable';
const QUT_USERNAME = "n10937668@qut.edu.au";
const pollMessages = async () => {
    const params = {
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
    };

    try {
        const data = await sqsClient.send(new ReceiveMessageCommand(params));
        console.log("Received messages:", data.Messages);


        if (data.Messages) {
            for (const message of data.Messages) {
                const body = JSON.parse(message.Body);
                const { videoId, key, fileName } = body;
                console.log("SQS KEY", key)

                const decodedKey = decodeURIComponent(key).replace(/\+/g, ' ');
                const decodedfilename = decodeURIComponent(fileName).replace(/\+/g, ' ');
                console.log("SQS KEY", decodedKey)
                console.log("SQS NAME", decodedfilename)
                // Query DynamoDB to check if there's a video entry with 'queued' or 'in-progress' status
                const queryParams = {
                    TableName: TABLE_NAME,
                    KeyConditionExpression: "#qut_username = :qut_username",
                    FilterExpression: "#status IN (:queued, :in_progress) AND id = :videoId",
                    ExpressionAttributeValues: {
                        ":qut_username": QUT_USERNAME,
                        ":queued": "queued",
                        ":in_progress": "in-progress",
                        ":videoId": videoId
                    },
                    ExpressionAttributeNames: {
                        "#qut_username": "qut-username",
                        "#status": "status"
                    }
                };


                console.log("Querying DynamoDB with params:", queryParams);

                const existingVideos = await docClient.send(new QueryCommand(queryParams));

                console.log("Existing videos found:", existingVideos.Items);

                if (existingVideos.Items && existingVideos.Items.length > 0) {
                    console.log("Video is already being processed or queued. Skipping...");
                    continue;
                }


                // Update DynamoDB to set status to 'in-progress' for the current video
                await docClient.send(new UpdateCommand({
                    TableName: TABLE_NAME,
                    Key: { "qut-username": QUT_USERNAME, name: decodedfilename },
                    UpdateExpression: "SET #status = :in_progress",
                    ExpressionAttributeNames: {
                        "#status": "status"
                    },
                    ExpressionAttributeValues: {
                        ":in_progress": "in-progress"
                    }
                }));


                console.log('Starting video transcoding for:', videoId);


                try {
                    await processVideoData(videoId, decodedKey, decodedfilename); // Process the video
                    // console.log(`Transcoding completed for video: ${videoId}`);
                    //
                    // // Update the status in DynamoDB to 'completed'
                    // await docClient.send(new UpdateCommand({
                    //     TableName: TABLE_NAME,
                    //     Key: { "qut-username": QUT_USERNAME, name: fileName },
                    //     UpdateExpression: "SET #status = :completed",
                    //     ExpressionAttributeNames: {
                    //         "#status": "status"
                    //     },
                    //     ExpressionAttributeValues: {
                    //         ":completed": "completed"
                    //     }
                    // }));

                } catch (error) {
                    console.error('Error processing video:', error);
                }

                // Delete the message from the SQS queue
                await sqsClient.send(new DeleteMessageCommand({
                    QueueUrl: QUEUE_URL,
                    ReceiptHandle: message.ReceiptHandle,
                }));
                console.log(`Message deleted from SQS: ${videoId}`);
            }
        } else {
            console.log("No messages received.");
        }
    } catch (error) {
        console.error('Error polling messages from SQS:', error);
    }
};

// Self-invoking function to continuously poll the queue
(async function pollContinuously() {
    await pollMessages();
    setTimeout(pollContinuously, 10000); // Wait 10 seconds between polls
})();
module.exports = { pollMessages };
