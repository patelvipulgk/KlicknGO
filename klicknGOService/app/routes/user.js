var express = require('express');
var router = express.Router();
var passport	= require('passport');
var auth = require('../../config/passport')(passport);
var User = require('../models/user');
var Response = require('../models/response');

router.route('/users')

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
	.post(function(req, res){
        if (!(req.body.firstName || req.body.lastName)) {
            //handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
            res.status(400).json(new Response(400, false, "", "Must provide a first or last name."));
            return;
        }
		var user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			mobile: req.body.mobile,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            city: req.body.city,
            country: req.body.country,
            shopName: req.body.shopName,
            workingHour: req.body.workingHour,
            userType: req.body.userType,
            created: new Date()
        });
		// save the data
		user.save(function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(new Response(200, true, user, "User added."));
        });
	});

router.route("/users/:id")
	// get paticular individual users
	.get(function(req, res){
		User.findById(req.params.id,function(err, user){
        	if(err) {
                response = new Response(200, true, "", "No user found.");
            } else {
                response = new Response(200, true, user, "User found.");
            }
            res.json(response);
        });
	})
	
	// update individual user
	.put(function(req, res){
		var response = {};
		User.findById(req.params.id,function(err,user){
            if(err) {
            	res.status(500).json(new Response(500, false, "", err));
                return;
            } else {
                // save the data
                if(req.body.firstName !== undefined) {
                    user.firstName = req.body.firstName;
                }
                if(req.body.lastName !== undefined) {
                    user.lastName = req.body.lastName;
                }
                if(req.body.mobile !== undefined) {
                    user.mobile = req.body.mobile;
                }
                if(req.body.gender !== undefined) {
                    user.gender = req.body.gender;
                }
                if(req.body.dateOfBirth !== undefined) {
                    user.dateOfBirth = req.body.dateOfBirth;
                }
                if(req.body.city !== undefined) {
                    user.city = req.body.city;
                }
                if(req.body.country !== undefined) {
                    user.country = req.body.country;
                }
                if(req.body.shopName !== undefined) {
                    user.shopName = req.body.shopName;
                }
                if(req.body.workingHour !== undefined) {
                    user.workingHour = req.body.workingHour;
                }
                if(req.body.userType !== undefined) {
                    user.userType = req.body.userType;
                }

                user.save(function(err){
                    if(err) {
            	        res.status(500).json(new Response(500, false, "", err));
                        return;
                    } else {
                        res.json(new Response(200, true, user, "User Updated."));
                    }
                });
            }
        });
	})
	
	// delete product
	.delete(function(req, res){
		User.findById(req.params.id,function(err,user){
            if(err) {
            	res.status(500).json(new Response(500, false, "", err));
                return;
            } else {
                // data exists, remove it.
            	user.remove({_id : req.params.id},function(err){
                    if(err) {
                    	res.status(500).json(new Response(500, false, "", err));
                        return;
                    } else {
                    	res.json(new Response(200, true, user, "User deleted."));
                    }
                    
                });
            }
        });
	});


function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

module.exports = router;