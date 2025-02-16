const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../app/models/user.model');

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback'
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await User.findUser(profile.emails[0].value);

					if (!user.length) {
						const data = {
							googleId: profile.id,
							username: profile.displayName,
							email: profile.emails[0].value,
							profileImage: profile.photos[0].value,
							ip: '',
							lastLoggedIn: new Date()
						};
						const details = await User.save(data);
						return done(null, details);
					}
					return done(null, user[0]);
				} catch (error) {
					return done(error, null);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser(async (user, done) => {
		try {
			done(null, user);
		} catch (error) {
			done(error, null);
		}
	});
};
