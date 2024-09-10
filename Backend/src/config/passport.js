const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.error(err));
    }));
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'], // Define scopes here
          },
          async (accessToken, refreshToken, profile, done) => {
            // Check if user exists in your database
            try {
              let user = await User.findOne({ googleId: profile.id });
              if (user) {
                return done(null, user);
              }
      
              // If user doesn't exist, create a new one
              user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
              });
              await user.save();
              done(null, user);
            } catch (error) {
              console.error('Error handling user:', error);
              done(error, null);
            }
          }
        )
      )
};