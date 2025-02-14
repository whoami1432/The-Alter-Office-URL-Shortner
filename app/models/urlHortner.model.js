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

exports.findUShortURLAnalytics = async shortUrl => {
	const analyticsQuery = `
		WITH 
			total_clicks AS (
				SELECT COUNT(*) AS total FROM url_analytics WHERE longurlid = $1
			),
			unique_users AS (
				SELECT COUNT(DISTINCT ipAddress) AS unique_users FROM url_analytics WHERE longurlid = $1
			),
			clicks_by_date AS (
				SELECT DATE(timestamp) AS date, COUNT(*) AS click_count 
				FROM url_analytics 
				WHERE longurlid = $1 AND timestamp >= NOW() - INTERVAL '7 days' 
				GROUP BY date 
				ORDER BY date DESC
			),
			os_type AS (
				SELECT userAgent AS os_name, COUNT(*) AS unique_clicks, COUNT(DISTINCT ipAddress) AS unique_users 
				FROM url_analytics 
				WHERE longurlid = $1 
				GROUP BY os_name
			),
			device_type AS (
				SELECT 
					CASE 
						WHEN userAgent ~* 'mobile' THEN 'mobile' 
						ELSE 'desktop' 
					END AS device_name, 
					COUNT(*) AS unique_clicks, 
					COUNT(DISTINCT ipAddress) AS unique_users 
				FROM url_analytics 
				WHERE longurlid = $1 
				GROUP BY device_name
			)
		SELECT 
			(SELECT total FROM total_clicks) AS total_clicks,
			(SELECT unique_users FROM unique_users) AS unique_users,
			json_agg(clicks_by_date) AS clicks_by_date,
			json_agg(os_type) AS os_type,
			json_agg(device_type) AS device_type
		FROM clicks_by_date, os_type, device_type;
	`;

	const result = await pool.query(analyticsQuery, [data.rows[0].id]);
	return result;
};

exports.findTopicAnalytics = async topic => {
	const analyticsQuery = `
		WITH 
			total_clicks AS (
				SELECT COUNT(*) AS total FROM url_analytics ua
				JOIN urls u ON ua.longurlid = u.id
				WHERE u.topic = $1
			),
			unique_users AS (
				SELECT COUNT(DISTINCT ua.ipAddress) AS unique_users FROM url_analytics ua
				JOIN urls u ON ua.longurlid = u.id
				WHERE u.topic = $1
			),
			clicks_by_date AS (
				SELECT DATE(ua.timestamp) AS date, COUNT(*) AS click_count 
				FROM url_analytics ua
				JOIN urls u ON ua.longurlid = u.id
				WHERE u.topic = $1 AND ua.timestamp >= NOW() - INTERVAL '7 days'
				GROUP BY date
				ORDER BY date DESC
			),
			urls_data AS (
				SELECT 
					u.shortUrl,
					COUNT(*) AS total_clicks,
					COUNT(DISTINCT ua.ipAddress) AS unique_users
				FROM url_analytics ua
				JOIN urls u ON ua.longurlid = u.id
				WHERE u.topic = $1
				GROUP BY u.topic, u.shortUrl
			)
		SELECT 
			(SELECT total FROM total_clicks) AS total_clicks,
			(SELECT unique_users FROM unique_users) AS unique_users,
			json_agg(clicks_by_date) AS clicks_by_date,
			json_agg(urls_data) AS urls
		FROM clicks_by_date, urls_data;
	`;

	const result = await pool.query(analyticsQuery, [topic]);
	return result;
};

exports.overallAnalytics = async topic => {
	const analyticsQuery = `
		WITH 
			user_urls AS (
				SELECT shortUrl FROM urls WHERE createdBy = $1
			),
			total_urls AS (
				SELECT COUNT(*) AS total FROM user_urls
			),
			total_clicks AS (
				SELECT COUNT(*) AS total FROM url_analytics WHERE shortUrl IN (SELECT shortUrl FROM user_urls)
			),
			unique_users AS (
				SELECT COUNT(DISTINCT ipAddress) AS unique_users FROM url_analytics WHERE shortUrl IN (SELECT shortUrl FROM user_urls)
			),
			clicks_by_date AS (
				SELECT DATE(timestamp) AS date, COUNT(*) AS click_count 
				FROM url_analytics 
				WHERE shortUrl IN (SELECT shortUrl FROM user_urls)
				GROUP BY date
				ORDER BY date DESC
			),
			os_type AS (
				SELECT userAgent AS os_name, COUNT(*) AS unique_clicks, COUNT(DISTINCT ipAddress) AS unique_users 
				FROM url_analytics 
				WHERE shortUrl IN (SELECT shortUrl FROM user_urls)
				GROUP BY os_name
			),
			device_type AS (
				SELECT 
					CASE 
						WHEN userAgent ~* 'mobile' THEN 'mobile' 
						ELSE 'desktop' 
					END AS device_name, 
					COUNT(*) AS unique_clicks, 
					COUNT(DISTINCT ipAddress) AS unique_users 
				FROM url_analytics 
				WHERE shortUrl IN (SELECT shortUrl FROM user_urls)
				GROUP BY device_name
			)
		SELECT 
			(SELECT total FROM total_urls) AS total_urls,
			(SELECT total FROM total_clicks) AS total_clicks,
			(SELECT unique_users FROM unique_users) AS unique_users,
			json_agg(clicks_by_date) AS clicks_by_date,
			json_agg(os_type) AS os_type,
			json_agg(device_type) AS device_type
		FROM clicks_by_date, os_type, device_type;
	`;

	const result = await pool.query(analyticsQuery, [userId]);

	return result;
};
