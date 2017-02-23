var express = require('express');
var router = express.Router();
var passport	= require('passport');
var auth = require('../../config/passport')(passport);
var User = require('../models/user');
var Response = require('../models/response');

router.route('/contacts')

	//returns all user
	.get(auth.authenticate(), function(req, res){
		User.find({}, function (err, user) {
            if (err) {
            	res.status(500).json(new Response(500, false, "", err));
                return;
            }
            res.json(new Response(200, true, user, "User found."));
        });
	})
	
	// add user 
	.post(auth.authenticate(), function(req, res){
        /** Get list of the users */
        User.find({
            'mobile': { $in: req.body}},function(err, user){
            if(err) {
                response = new Response(200, true, "", "No user found.");
            } else {
                response = new Response(200, true, user, "User found.");
            }
            res.json(response);
        });
   });

module.exports = router;