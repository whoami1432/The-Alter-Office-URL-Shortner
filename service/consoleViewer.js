'use strict';
const { logger } = require('../config/logger');

const consoleWritter = port => {
	logger.info({ message: `\n------------------------------------------------- \n Port running on ${port}\n -------------------------------------------------` });
	console.log(`\nStarting the development server...\n`);
	console.log(`Compiled successfully!\n`);
	console.log(`Example app listening on port ${port}!\n`);
	console.log(`You can now view URL-Shortner in the browser.\n`);
	console.log('\x1b[32m%s\x1b[0m', `     Local : ${process.env.API_BASE_URL}api/helloworld`);
	console.log(`\nProject running successfully !`);
};

module.exports = { consoleWritter };
