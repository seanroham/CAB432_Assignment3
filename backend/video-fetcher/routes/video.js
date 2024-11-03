const express = require('express');
const router = express.Router();
const videoFetcher = require('../controllers/videoFetcher');
const multer = require('multer');

const storage = multer.memoryStorage();

router.get('/videos', videoFetcher.getVideos);

module.exports = router;
