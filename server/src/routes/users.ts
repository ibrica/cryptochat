/**
 * User routes
 */
import { Router, Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import {SECRET} from '../config/settings';
import configPassport from '../config/passport';
import User from '../models/user';

configPassport(passport);

const router: Router = Router();



router.post('/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    // save the user
    newUser.save((err) => {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username,
  }, (err, user) =>  {
    if (err) { throw err; };

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password,  (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.toJSON(), SECRET);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

/**
 * User home route
 */


export const userRoutes: Router = router;

