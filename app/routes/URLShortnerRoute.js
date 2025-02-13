'use strict';
const express = require('express');

const router = express.Router();

const urlShortner = require('../controllers/urlShortner.controller');
const { shortUrlLimiter } = require('../../middlewares/rateLimiter');

router.post('/shorten', shortUrlLimiter, urlShortner.createShortURL);
router.get('/shorten/:shortUrl', urlShortner.ShortURL);

module.exports = router;
