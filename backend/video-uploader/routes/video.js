const express = require('express');
const router = express.Router();
const videoUploader = require('../controllers/videoUploader');

// Route to generate a pre-signed URL for video upload
router.post('/upload', videoUploader.generateUploadUrl);


module.exports = router;
