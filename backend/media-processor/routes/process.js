const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoTranscoder');
const multer = require('multer');

const storage = multer.memoryStorage();


// Route to initiate the transcoding process after the file is uploaded to S3
router.post('/process', videoController.processVideo);

module.exports = router;
