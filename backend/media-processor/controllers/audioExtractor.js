const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { PutObjectCommand, S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function extractAndUploadAudio(videoPath, audioKey) {
    const audioFilename = `/tmp/${audioKey.split('/').pop()}`; // local tmp file for the audio

    try {
        console.log(`Starting audio extraction from video at ${videoPath}...`);
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo()
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

        console.log('Uploading extracted audio to S3...');
        const audioS3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: audioKey,
            Body: fs.createReadStream(audioFilename),
            ContentType: 'audio/mpeg',
        };

        await s3Client.send(new PutObjectCommand(audioS3Params));
        console.log('Audio uploaded to S3.');

// generating the signed url for the audio file
        const audioSignedUrl = await getSignedUrl(s3Client, new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: audioKey,
        }), { expiresIn: 3600 });

        fs.unlinkSync(audioFilename);         // Cleanup temporary audio file
        console.log('Temporary audio file deleted.');

        return audioSignedUrl;
    } catch (err) {
        console.error('Error in audio extraction/upload process:', err);
        throw err;
    }
}

module.exports = { extractAndUploadAudio };
