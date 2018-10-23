import {Strategy, ExtractJwt} from 'passport-jwt';
import User from '../models/user';
import * as settings from '../config/settings';

export default function(passport) {
  let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey : settings.SECRET,
  };
  passport.use(new Strategy(opts, (jwtPayload, done) => {
    User.findOne({id: jwtPayload.id}, (err, user) => {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};

/* Alternative version
import { Request, Response, NextFunction } from 'express';
import * as passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 /
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: 'Invalid email or password.' });
    });
  });
}));
*/
