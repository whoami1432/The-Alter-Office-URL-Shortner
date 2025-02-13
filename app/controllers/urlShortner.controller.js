'use strict';

const shortid = require('shortid');
const validUrl = require('valid-url');
const geoip = require('geoip-lite');

const { logger } = require('../../config/logger');
const pool = require('../../database/db');
const urlShortner = require('../models/urlHortner.model');

exports.createShortURL = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} urlSortner request received` });

		const { longUrl, customAlias, topic } = req.body;

		if (!longUrl || !validUrl.isUri(longUrl)) {
			return res.status(400).json({ error: 'Invalid URL provided' });
		}

		let shortUrl = customAlias || shortid.generate();

		const existingUrl = await urlShortner.findUShortURL(shortUrl);
		if (existingUrl.rows.length > 0) {
			return res.status(400).json({ error: 'Custom alias is already taken' });
		}

		const newUrl = await urlShortner.saveShortURL(longUrl, shortUrl, topic);

		res.status(201).json({ shortUrl: `http://localhost:9092/api/url/${shortUrl}`, createdAt: newUrl.createdat });
	} catch (error) {
		next(error);
	}
};

exports.ShortURL = async (req, res, next) => {
	try {
		const url = await urlShortner.findUShortURL(req.params.shortUrl);
		if (url.rows.length === 0) {
			return res.status(404).json({ error: 'Short URL not found' });
		}

		// Capture Analytics Data
		const userAgent = req.headers['user-agent'] || 'Unknown';
		const ipAddress = req.ip || req.connection.remoteAddress;
		const geoLocation = geoip.lookup(ipAddress) || {};
		await urlShortner.saveURLAnalytics(url.rows[0].id, userAgent, ipAddress, geoLocation);

		res.redirect(url.rows[0].longurl);
	} catch (err) {
		next(err);
	}
};
