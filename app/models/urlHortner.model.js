const pool = require('../../database/db');

exports.findUShortURL = async shortUrl => {
	const data = await pool.query('SELECT * FROM urls WHERE shortUrl = $1', [shortUrl]);
	return data;
};

exports.saveShortURL = async (longUrl, shortUrl, topic) => {
	const { rows } = await pool.query('INSERT INTO urls (longUrl, shortUrl, topic) VALUES ($1, $2, $3) RETURNING *', [longUrl, shortUrl, topic]);
	return rows[0];
};

exports.saveURLAnalytics = async (id, userAgent, ipAddress, geoLocation) => {
	const { rows } = await pool.query('INSERT INTO url_analytics (longurlid, userAgent, ipAddress, geoLocation) VALUES ($1, $2, $3, $4)', [id, userAgent, ipAddress, geoLocation]);
	return rows[0];
};
