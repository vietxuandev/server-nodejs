const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');

const User = require('../models/user.model');

// Passport Jwt
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);
        user.password = undefined;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Local Sign Up
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (user) {
          const error = new APIError('User already exists', 500, true);
          return done(error, false);
        } else {
          const newUser = new User();
          newUser.email = email;
          newUser.password = newUser.hashPassword(password);
          newUser.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              user.hashPassword = undefined;
              return done(null, newUser);
            }
          });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Local Sign In
passport.use(
  'signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        const isCorrectPassword = await user.comparePassword(password);
        if (!isCorrectPassword) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Passport Google
passport.use(
  'auth-google',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check whether this current user exists in our database
        const user = await User.findOne({
          email: profile.emails[0].value,
        });
        if (user) return done(null, user);
        // If new account
        const newUser = new User({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Passport Facebook
passport.use(
  'auth-facebook',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check whether this current user exists in our database
        const user = await User.findOne({
          email: profile.emails[0].value,
        });
        if (user) return done(null, user);
        // If new account
        const newUser = new User({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
