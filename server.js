'use strict';

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const session = require('express-session');
const passport = require('passport');

const app = express();

const authRoutes = require('./app/routes/auth');
const helloWorldRoute = require('./app/routes/helloWorld.route');
const { requestId } = require('./service/uuidGenerator');
const { consoleWritter } = require('./service/consoleViewer');
const notFound = require('./middlewares/notFound');
const erorrHandler = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');
const everyReqDetails = require('./middlewares/everyReqCatcher');
const URLShortnerRoute = require('./app/routes/URLShortnerRoute');

const port = process.env.PORT;

process.on('uncaughtException', error => {
	console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled rejection:', error);
});

app.use(limiter);
app.use(hpp());
app.use('*', cors());
app.use(compression({ level: 1 }));
app.use(requestId);
app.use(helmet());
app.use(express.json({ limit: '500mb', extended: true }));
app.use(everyReqDetails);
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }
	})
);
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Protected route example
app.get('/profile', (req, res) => {
	console.log(req.isAuthenticated(), req.isUnauthenticated(), ' check1');
	if (!req.isAuthenticated()) return res.redirect('/auth/google');
	res.json({
		user: req.user,
		session: req.session
	});
});

// Home route
app.get('/', (req, res) => {
	res.send('<a href="/auth/google">Login with Google</a>');
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/', helloWorldRoute);
app.use('/api/', URLShortnerRoute);
app.get('/health_check', (req, res) => res.status(200).send('Hello World!'));

// error handlers
app.use('*', notFound);
app.use(erorrHandler);

app.listen(port, () => {
	consoleWritter(port);
});
