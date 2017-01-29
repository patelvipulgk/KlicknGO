var express = require('express');
var router = express.Router();
var passport	= require('passport');
var config      = require('../../config/db'); // get db config file
var jwt         = require('jwt-simple');
var auth = require('../../config/passport')(passport);
var User = require('../models/user');

router.route('/authenticate')

  .post(function (req, res) {
    User.findOne({
      mobile: req.body.mobile
    }, function (err, user) {
      if (err) throw err;

      if (!user) {
        res.send({success: false, msg: 'Authentication failed. User not found.'})
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.encode(user, config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token });
          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

module.exports = router;
