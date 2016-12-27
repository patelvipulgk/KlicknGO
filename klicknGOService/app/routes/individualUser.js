var express = require("express");
var router = express.Router();
var IndividualUser = require("../models/individualUser");

router.route('/individual/users')

	//returns all IndividualUser
	.get(function(req, res){
		IndividualUser.find({}, function (err, individualUser) {
            if (err) {
            	res.status(500).send(err);
                return;
            }
            res.json(individualUser);
        });
	})
	
	// add individualUser 
	.post(function(req, res){
        if (!(req.body.firstName || req.body.lastName)) {
            handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
        }
		var individualUser = new IndividualUser({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
			mobile: req.body.mobile,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            city: req.body.city,
            country: req.body.country,
            created: new Date()
        });
		// save the data
		individualUser.save(function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({message: "Individual User Added."});
        });
	});

router.route("/individual/users/:id")
	// get paticular individual users
	.get(function(req, res){
		var response = {};
        IndividualUser.findById(req.params.id,function(err,individualUser){
        	if(err) {
                response = {message: "No individual user found."};
            } else {
                response = individualUser;
            }
            res.json(response);
        });
	})
	
	// update individual user
	.put(function(req, res){
		var response = {};
		IndividualUser.findById(req.params.id,function(err,individualUser){
            if(err) {
            	res.status(500).send(err);
                return;
            } else {
                // save the data
                if(req.body.firstName !== undefined) {
                    individualUser.firstName = req.body.firstName;
                }
                if(req.body.lastName !== undefined) {
                    individualUser.lastName = req.body.lastName;
                }
                if(req.body.mobile !== undefined) {
                    individualUser.mobile = req.body.mobile;
                }
                if(req.body.gender !== undefined) {
                    individualUser.gender = req.body.gender;
                }
                if(req.body.dateOfBirth !== undefined) {
                    individualUser.dateOfBirth = req.body.dateOfBirth;
                }
                if(req.body.city !== undefined) {
                    individualUser.city = req.body.city;
                }
                if(req.body.country !== undefined) {
                    individualUser.country = req.body.country;
                }

                individualUser.save(function(err){
                    if(err) {
                    	res.status(500).send(err);
                        return;
                    } else {
                        response = {message: "individual user Updated."};
                    }
                    res.json(response);
                });
            }
        });
	})
	
	// delete product
	.delete(function(req, res){
		IndividualUser.findById(req.params.id,function(err,individualUser){
            if(err) {
            	res.status(500).send(err);
            	return;
            } else {
                // data exists, remove it.
            	IndividualUser.remove({_id : req.params.id},function(err){
                    if(err) {
                    	res.status(500).send(err);
                    	return;
                    } else {
                    	res.json({message: "IndividualUser Deleted."});
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