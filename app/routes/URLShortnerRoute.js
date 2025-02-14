'use strict';
const express = require('express');

const router = express.Router();

const urlShortner = require('../controllers/urlShortner.controller');
const { shortUrlLimiter } = require('../../middlewares/rateLimiter');

router.post('/shorten', shortUrlLimiter, urlShortner.createShortURL);
router.get('/shorten/:shortUrl', urlShortner.ShortURL);
router.get('/analytics/:shortUrl', urlShortner.findUShortURLAnalytics);
router.get('/analytics/topic/:topic', urlShortner.findTopicAnalytics);
router.get('/analytics/overall', urlShortner.overallAnalytics);

module.exports = router;
