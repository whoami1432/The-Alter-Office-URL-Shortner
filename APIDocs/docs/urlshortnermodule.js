/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a shortened URL
 *     description: Generates a short URL from a given long URL. Optionally, a custom alias and topic can be provided.
 *     tags:
 *       - URL Shortener
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com"
 *               customAlias:
 *                 type: string
 *                 description: Optional custom alias for the shortened URL.
 *                 example: "myalias"
 *               topic:
 *                 type: string
 *                 description: Optional category for the shortened URL.
 *                 example: "tech"
 *     responses:
 *       201:
 *         description: Successfully created a shortened URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "http://localhost:9092/api/url/myalias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-02-15T12:34:56Z"
 *       400:
 *         description: Bad request. Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid URL provided"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /api/shorten/{shortUrl}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Retrieves the original long URL based on the provided shortened URL and redirects the user to it. Also captures analytics data like user-agent, IP address, and geolocation.
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias to be resolved.
 *         example: "myalias"
 *     responses:
 *       302:
 *         description: Successfully found the original URL and redirected the user.
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: "https://example.com"
 *       400:
 *         description: Bad request. The short URL parameter is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Short URL is required"
 *       404:
 *         description: Not found. The short URL does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Short URL not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /analytics/{shortUrl}:
 *   get:
 *     summary: Get analytics for a shortened URL
 *     description: Retrieve click analytics, unique users, and device information for a given short URL.
 *     tags:
 *       - URL Shortener
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The shortened URL identifier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   example: 120
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 80
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-02-14"
 *                       clicks:
 *                         type: integer
 *                         example: 30
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       os:
 *                         type: string
 *                         example: "Windows"
 *                       count:
 *                         type: integer
 *                         example: 50
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       device:
 *                         type: string
 *                         example: "Mobile"
 *                       count:
 *                         type: integer
 *                         example: 70
 *       400:
 *         description: Bad request, missing short URL parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Short URL is required"
 *       404:
 *         description: Short URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Short URL not found"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * paths:
 *   /analytics/topic/{topic}:
 *     get:
 *       summary: Get analytics for a specific topic
 *       description: Fetches analytics data for a given topic, including total clicks, unique users, and clicks by date.
 *       tags:
 *          - URL Shortener
 *       parameters:
 *         - name: topic
 *           in: path
 *           required: true
 *           description: The topic for which analytics is requested
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved topic analytics
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   totalClicks:
 *                     type: integer
 *                     description: Total number of clicks
 *                   uniqueUsers:
 *                     type: integer
 *                     description: Unique users who clicked
 *                   clicksByDate:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                         clicks:
 *                           type: integer
 *                     description: Click counts grouped by date
 *                   urls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of URLs associated with the topic
 *         400:
 *           description: Topic is required
 *         404:
 *           description: Topic not found
 */

/**
 * @openapi
 * paths:
 *   /analytics/overall:
 *     get:
 *       summary: Get overall analytics
 *       description: Fetches overall analytics including total URLs, total clicks, unique users, and device usage data.
 *       tags:
 *           - URL Shortener
 *       responses:
 *         200:
 *           description: Successfully retrieved overall analytics
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   totalUrls:
 *                     type: integer
 *                     description: Total number of URLs shortened
 *                   totalClicks:
 *                     type: integer
 *                     description: Total number of clicks on all shortened URLs
 *                   uniqueUsers:
 *                     type: integer
 *                     description: Unique users who interacted with the links
 *                   clicksByDate:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                         clicks:
 *                           type: integer
 *                     description: Click counts grouped by date
 *                   osType:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         os:
 *                           type: string
 *                         count:
 *                           type: integer
 *                     description: Number of clicks by operating system
 *                   deviceType:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         device:
 *                           type: string
 *                         count:
 *                           type: integer
 *                     description: Number of clicks by device type
 */
