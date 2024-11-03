const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

/**
 * Extracts audio from a video file and uploads to S3
 * @param {string} videoPath - Local path to the video file
 * @param {string} audioKey - S3 key for the uploaded audio file
 * @returns {Promise<string>} - Signed URL for the uploaded audio file
 */
async function extractAndUploadAudio(videoPath, audioKey) {
    const audioFilename = `/tmp/${audioKey.split('/').pop()}`; // Local path for temporary audio file

    try {
        // Step 1: Extract audio from video
        console.log(`Starting audio extraction from video at ${videoPath}...`);

        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo() // Ensure we're only extracting audio
                .output(audioFilename)
                .audioCodec('libmp3lame')
                .on('start', commandLine => console.log('FFmpeg command:', commandLine))
                .on('stderr', stderrLine => console.log('FFmpeg stderr output:', stderrLine))
                .on('end', () => {
                    console.log('Audio extraction completed.');
                    resolve();
                })
                .on('error', err => {
                    console.error('FFmpeg encountered an error:', err);
                    reject(err);
                })
                .run();
        });

        // Step 2: Upload extracted audio to S3
        console.log('Uploading extracted audio to S3...');
        const audioS3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: audioKey,
            Body: fs.createReadStream(audioFilename),
            ContentType: 'audio/mpeg',
            ACL: 'private',
        };

        await s3Client.send(new PutObjectCommand(audioS3Params));
        console.log('Audio uploaded to S3.');

        // Step 3: Generate signed URL for the audio file
        const audioSignedUrl = await getSignedUrl(s3Client, new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: audioKey,
        }), { expiresIn: 3600 });

        // Cleanup temporary audio file
        fs.unlinkSync(audioFilename);
        console.log('Temporary audio file deleted.');

        return audioSignedUrl;
    } catch (err) {
        console.error('Error in audio extraction/upload process:', err);
        throw err;
    }
}

module.exports = { extractAndUploadAudio };
