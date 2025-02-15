# The Alter Office URL Shortener

The Alter Office URL Shortener is a web application built with Node.js and Express, designed to shorten URLs efficiently while ensuring security and performance. The application is hosted at:

**Live URL:** [https://the-alter-office-url-shortner.onrender.com](https://the-alter-office-url-shortner.onrender.com)

## Features

- **Express**: Web framework for Node.js.
- **Rate Limiter**: Middleware to limit repeated requests to public APIs and/or endpoints.
- **Nodemon**: Automatically restarts the server for development.
- **Winston**: Logging library for structured application logs.
- **UUID**: Generates unique request IDs for tracking.
- **Compression**: Uses Gzip compression for improved performance.
- **Helmet**: Security middleware for setting HTTP headers.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Body-Parser**: Middleware to parse incoming request bodies.
- **Error Handling**: Standardized error responses for better debugging and consistency.
- **HPP (HTTP Parameter Pollution Prevention)**: Protects against HTTP parameter pollution attacks.
- **Request Logging**: Logs request body, params, query, and headers for debugging and auditing.
- **Prettier**: Code formatter for maintaining a consistent code style.
- **.gitignore**: Pre-configured to exclude sensitive files and directories.

## Database Configuration (PostgreSQL)

This project uses PostgreSQL as the database. Below are the required environment variables:

```env
DATABASE_HOST=<your-database-host>
DATABASE_USER=<your-database-user>
DATABASE_PASSWORD='<your-database-password>'
DATABASE_PORT=20866 # PostgreSQL default port
DATABASE_NAME=theAlterOffice
DATABASE_SSH=1
```

## Installation

To install and run the application locally, follow these steps:

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/the-alter-office-url-shortner.git
    cd the-alter-office-url-shortner
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the required environment variables as mentioned in the "Database Configuration" section.

4. Start the application:
    ```sh
    npm start
    ```

## Usage

Once the application is running, you can access it at `http://localhost:3000`. Use the provided API endpoints to shorten URLs and manage them.

## API Endpoints

- `POST /api/shorten`: Shorten a new URL.
- `GET /api/shorten/{alias}`: Redirect to the original URL.
- `GET /api/analytics/{alias}`: Get a list of all shortened URLs.
- `GET /api/analytics/topic/{topic}`: Get a list of all shortened URLs.
- `GET /api/analytics/overall`: Get a list of all shortened URLs.
- `GET /api-docs`: Access the Swagger API documentation.

## Swagger API Documentation

The application includes Swagger for API documentation. You can access the Swagger UI at the `/api-docs` endpoint to explore and test the API endpoints interactively.
