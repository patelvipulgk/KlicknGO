var Conversation = require('../models/conversation'),
    ConversationReply = require('../models/conversation-reply'),
    User = require('../models/user');
    
var conv = {
    isConversationPresent: function(data, callback) {
        /** Function to check conversation is present in conversations table */
        var is_present = false;
        var con_id = "";
        Conversation.findOne().or([
            { $and: [{ to_id: data.to_id, from_id: data.from_id }] },
            { $and: [{ to_id: data.from_id, from_id: data.to_id }] }
        ]).exec(function(err, result) {
            if (err) throw err;
            console.log("Is conversation present : " + JSON.stringify(result));
            if (result) {
                /* data for callback starts*/
                is_present = true;
                con_id = result.con_id;
            } else {
                //data for callback 
                is_present = false;
                con_id = 0
            }
            callback({
                is_present: is_present,
                con_id: con_id
            });
        });

    },
    insertConversation: function(data, callback) {
        /** create a new ConversationReply */
        var newConversation = new Conversation({
            from_id: data.from_id,
            to_id: data.to_id,
            con_id: data.con_id
        });

        /** Save conversation reply */
        newConversation.save(function(err, result) {
            if (err) throw err;
            console.log('conversation created!' + newConversation._id);
            callback(result._id);
        });
    },
    insertMsg: function(data, callback) {
        var newConversationReply = new ConversationReply({
            reply: data.msg,
            from_id: data.from_id,
            to_id: data.to_id,
            con_id: data.con_id
        });

        // save the user
        newConversationReply.save(function(err, result) {
            if (err) throw err;
            console.log('conversation reply created!' + result._id);
            callback(result);
        });
    },
    callMsgAfterConversation: function(data, callback) {
        /** Insert msg in collections **/
        conv.insertConversation(data, function(is_insert_conversation) {

            /** Save msg in converstion reply */
            conv.insertMsg(data, function(is_insert_msg) {
                callback({
                    msg: data.msg,
                    from_id: data.from_id,
                    to_id: data.to_id,
                });
            });
        });
    },
    getUserInfo: function(uid, callback) {
        /** Get user information */
        User.findById(uid, function(err, user) {
            if (err) throw err;
            callback(user);
        });

    },
    getLastConversationId: function(callback) {
        Conversation.findOne()
            .sort('-con_id')
            .exec(function(err, result) {
                if (result) {
                    var conversationid = result.con_id;
                    conversationid++;
                    callback({
                        ID: conversationid
                    });
                } else {
                    callback({
                        ID: 0
                    });
                }
            });
    },
    saveMsgs: function(data, callback) {
        var checkData = { to_id: data.to_id, from_id: data.from_id };
        /** Checking coverstion already availble or not*/
        conv.isConversationPresent(checkData, function(isPresent) {
            console.log('Is present ' + isPresent.is_present);
            if (isPresent.is_present) {

                var msg_after_conversation = {
                    to_id: data.to_id,
                    from_id: data.from_id,
                    msg: data.msg,
                    con_id: isPresent.con_id
                };

                /** Insert message and conversation */
                conv.callMsgAfterConversation(msg_after_conversation, function(insert_con_msg) {
                    conv.getUserInfo(data.from_id, function(UserInfo) {
                        insert_con_msg.name = UserInfo.fname + ' ' + UserInfo.lname;
                        insert_con_msg.thumb = UserInfo.thumbnail;
                        insert_con_msg.gender = UserInfo.gender;
                        callback(insert_con_msg);
                    });
                });


            } else {
                /** Get Last conversation id */
                conv.getLastConversationId(function(con_id) {

                    var msg_after_conversation = {
                        to_id: data.to_id,
                        from_id: data.from_id,
                        msg: data.msg,
                        con_id: con_id.ID
                    };

                    /** Insert message and conversation */
                    conv.callMsgAfterConversation(msg_after_conversation, function(insert_con_msg) {
                        conv.getUserInfo(data.from_id, function(UserInfo) {
                            insert_con_msg.name = UserInfo.fname + ' ' + UserInfo.lname;
                            insert_con_msg.thumb = UserInfo.thumbnail;
                            insert_con_msg.gender = UserInfo.gender;
                            callback(insert_con_msg);
                        });
                    });
                });
            }
        });

    },
    getHistory: function(data, start, limit, callback) {
        conv.isConversationPresent(data, function(isPresent) {
            console.log("History conversation id" + JSON.stringify(isPresent) + "start : " + start + "limit :" + limit);
            ConversationReply.find({ con_id: isPresent.con_id })
                .sort('-created_at')
                .skip(start)
                .limit(limit)
                .exec(function(err, result) {
                    if (err) throw err;
                    var conversation = JSON.parse(JSON.stringify(result));
                    var totaltasks = conversation.length;
                    var tasksfinished = 0;

                    // helper function
                    var check = function() {
                        if (totaltasks == tasksfinished) {
                            callback(conversation);
                        }
                    }
                    for (var i = 0; i < conversation.length; i++) {
                        (function(i) {
                            conv.getUserInfo(conversation[i].from_id, function(UserInfo) {
                                conversation[i]['name'] = UserInfo.fname + ' ' + UserInfo.lname;
                                conversation[i]['thumb'] = UserInfo.thumbnail;
                                conversation[i]['gender'] = UserInfo.gender;
                                conversation[i]['msg'] = conversation[i]['reply'];
                                tasksfinished++;
                                check();
                            });
                        })(i);
                    }

                });
        });
    },
    getLatestConverstion: function(userId, callback) {
        Conversation.aggregate([
            { $match: {
                from_id: userId
            }},
            { $group: {
                _id: "$con_id"
                }},
            { "$sort": { "created_at": -1 
            }}
        ], function (err, result) {
            if (err) throw err;
            var totaltasks = result.length;
            var tasksfinished = 0;
            // helper function
            var check = function() {
                if (totaltasks == tasksfinished) {
                    console.log("Conversation Replay : " + JSON.stringify(result));
                    callback(result);
                }
            };
            for(let i = 0; i < result.length; i++) {
                console.log(result[i]._id);
                ConversationReply.findOne({ con_id: result[i]._id })
                    .sort('-created_at')
                    .exec(function(err, conversationReply) {
                        if (err) throw err;
                        var conversation = JSON.parse(JSON.stringify(conversationReply));
                        // helper function
                        conv.getUserInfo(conversation.from_id, function(UserInfo) {
                            result[i]['name'] = UserInfo.fname + ' ' + UserInfo.lname;
                            result[i]['thumb'] = UserInfo.thumbnail;
                            result[i]['gender'] = UserInfo.gender;
                            result[i]['msg'] = conversation.reply;
                            result[i]['con_id'] = conversation.con_id;
                            result[i]['to_id'] = conversation.to_id;
                            result[i]['from_id'] = conversation.from_id;
                            tasksfinished++;
                            check();
                        });
                            
                    });
            }
         
    });
    }
};

module.exports = conv;