const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Url Shortner',
			version: '1.0.0',
			description: 'URL Shortner API Documentation'
		},
		servers: [
			{
				url: process.env.API_BASE_URL,
				description: 'Url Shortner API'
			}
		]
	},
	apis: [path.join(__dirname, 'docs/*.js')]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
