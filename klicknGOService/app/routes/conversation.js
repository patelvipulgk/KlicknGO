var express = require('express');
var router = express.Router();
var passport	= require('passport');
var auth = require('../../config/passport')(passport);
var User = require('../models/user');
var Response = require('../models/response');
var helper = require('../utils/conversation');

/** Converstion  */
router.route("/users/:id/converstion")
	// get converstion list
	.get(function(req, res){
        var userId = req.params.id;
		console.log("Converstion : " + userId);
        helper.getLatestConverstion(userId, function(conversation) {
            res.json(new Response(200, true, conversation, "Conversation"));
        });

    });

module.exports = router;