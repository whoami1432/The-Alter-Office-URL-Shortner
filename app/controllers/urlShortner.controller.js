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

		if (!topic && !customAlias && longUrl) {
			return res.status(400).json({ error: 'Required filed not found please check' });
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
		if (!req.params.shortUrl) {
			return res.status(400).json({ error: 'Short URL is required' });
		}

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

exports.findUShortURLAnalytics = async (req, res, next) => {
	try {
		if (!req.params.shortUrl) {
			return res.status(400).json({ error: 'Short URL is required' });
		}

		const existingUrl = await urlShortner.findUShortURL(req.params.shortUrl);
		if (existingUrl.rows.length === 0) {
			return res.status(200).json({ error: 'Short URL not found' });
		}
		const URLAnalytics = await urlShortner.findUShortURLAnalytics(existingUrl.rows[0].id);
		if (URLAnalytics.rows.length === 0) {
			return res.status(200).json({
				totalClicks: URLAnalytics?.rows[0]?.total_clicks || 0,
				uniqueUsers: URLAnalytics?.rows[0]?.unique_users || 0,
				clicksByDate: URLAnalytics?.rows[0]?.clicks_by_date || [],
				osType: URLAnalytics?.rows[0]?.os_type || [],
				deviceType: URLAnalytics?.rows[0]?.device_type || []
			});
		}

		return res.status(200).json({
			totalClicks: URLAnalytics.rows[0].total_clicks,
			uniqueUsers: URLAnalytics.rows[0].unique_users,
			clicksByDate: URLAnalytics.rows[0].clicks_by_date || [],
			osType: URLAnalytics.rows[0].os_type || [],
			deviceType: URLAnalytics.rows[0].device_type || []
		});
	} catch (err) {
		next(err);
	}
};

exports.findTopicAnalytics = async (req, res, next) => {
	try {
		if (!req.params.topic) {
			return res.status(400).json({ error: 'Topic is required' });
		}

		const topicAnalytics = await urlShortner.findTopicAnalytics(req.params.topic);
		if (topicAnalytics.rows.length === 0) {
			return res.status(200).json({ error: 'Topic not found' });
		}

		return res.status(200).json({
			totalClicks: topicAnalytics.rows[0]?.total_clicks || 0,
			uniqueUsers: topicAnalytics.rows[0]?.unique_users || 0,
			clicksByDate: topicAnalytics.rows[0]?.clicks_by_date || [],
			urls: topicAnalytics.rows[0]?.urls || []
		});
	} catch (err) {
		next(err);
	}
};

exports.overallAnalytics = async (req, res, next) => {
	try {
		const overallAnalytics = await urlShortner.overallAnalytics();
		return res.status(200).json({
			totalUrls: overallAnalytics?.rows[0]?.total_urls || 0,
			totalClicks: overallAnalytics?.rows[0]?.total_clicks || 0,
			uniqueUsers: overallAnalytics?.rows[0]?.unique_users || 0,
			clicksByDate: overallAnalytics?.rows[0]?.clicks_by_date || [],
			osType: overallAnalytics?.rows[0]?.os_type || [],
			deviceType: overallAnalytics?.rows[0]?.device_type || []
		});
	} catch (err) {
		next(err);
	}
};
