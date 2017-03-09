var helper = require('../utils/conversation');
var productUtil = require('../utils/product');
var Product = require('../models/product');
var method = socket.prototype;
var users = [];

function socket(io) {
    /**	 Socket event starts */
    io.on('connection', function(socket) {
        console.log('Start Socket');
        socket.on('userInfo', function(userinfo) {
            // we store the username in the socket session for this client
            // socket.username = userinfo.username;
            // add the client's username to the global list
            //  usernames[username] = socket.id;
            var should_add = true;
            console.log("User length :" + users.length);
            if (users.length == 0) {
                //userinfo = JSON.parse(userinfo);
                userinfo.socketId = socket.id;
                console.log(userinfo.id + userinfo.mobile + socket.id);
                users.push(userinfo);
            } else {
                users.forEach(function(element, index, array) {
                    if (element.id == userinfo.id) {
                            should_add = false;
                    }
                });
                if (should_add) {
                    userinfo.socketId = socket.id;
                    users.push(userinfo);
                }
            }
            console.log(JSON.stringify(userinfo));
            /** Sending list of users to all users */
            /*users.forEach(function(element, index, array) {
                io.to(element.socketId).emit('userEntrance', users);
                console.log("===================================================" + index + JSON.stringify(array));
                console.log("Socket Id : " + element.socketId + JSON.stringify(users));
            });*/
            should_add = true;
            io.to(userinfo.socketId).emit('userEntrance', userinfo);
        });


        // echo to client they've connected
        //socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo to client their username
        //socket.emit('store_username', username);
        // echo globally (all clients) that a person has connected
        //socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected: ' + socket.id);
        // update the list of users in chat, client-side
        //io.sockets.emit('updateusers', usernames);

        /** 'sendMsg' will save the messages into DB. 	
		 * var data={
						socket_id:$scope.send_to_userinfo.socketId,
						to_id:$scope.send_to_userinfo.id,
						from_id:$scope.uid,
						msg:$scope.send_text
					};
		*/
        socket.on('sendMsg', function(data_server) {
            console.log('Data Server : ' + data_server);
            /** Calling saveMsgs to save messages into DB */
            helper.saveMsgs(data_server, function(result) {
                console.log(result);
                console.log('Get msg : ' + data_server.socket_id);
                console.log('Get msg result : ' + JSON.stringify(result));
                /** Chechking users is offline or not */
                if (data_server.socket_id == null) {

                    /**	If offline update the Chat list of Sender 
                    var singleUser = users.find(function(element) {
                        return element.id == data_server.from_id;
                    });*/
                    /** Calling 'getUserChatList' to get user chat list 
                    helper.getUserChatList(singleUser.id, connection, function(dbUsers) {
                        if (dbUsers === null) {
                            io.to(singleUser.socketId).emit('userEntrance', users);
                        } else {
                            /** Calling 'mergeUsers' to merge online and offline users 
                            helper.mergeUsers(users, dbUsers, 'no', function(mergedUsers) {
                                io.to(singleUser.socketId).emit('userEntrance', mergedUsers);
                            });
                        }
                    });*/

                    io.to(data_server.socket_id).emit('getMsg', result);
                } else {
                    /** If Online send message to receiver */
                    console.log('Online' + data_server.socket_id);
                    io.to(data_server.socket_id).emit('getMsg', result);
                }
            });
        });

        /** Sending Typing notification to user */
        socket.on('setTypingNotification', function(data_server) {
            console.log('Typing Data :' + JSON.stringify(data_server));
            io.to(data_server.socket_id).emit('getTypingNotification', data_server);
        });

        /** Socket disconnection */
        socket.on('disconnect', function() {
            console.log('Disconnect');
            var spliceId = "";
            for (var i = 0; i < users.length; i++) {
                if (users[i].socketId == socket.id) {
                    spliceId = i;
                    users.splice(spliceId, 1); //Removing single user
                    io.emit('exit', users[spliceId]);
                }
            }
        });

        /** Socket old chat */
        socket.on('showHistory', function(data, start, limit) {
            console.log('Show History' + JSON.stringify(data));
            if (!limit) {
                limit = 5;
            }
            if (!start) {
                start = 0;
            }
            helper.getHistory(data, start, limit, function(conversation) {
                io.to(data.socket_id).emit('getHistory', conversation);
            });
        });

        /** Send product */
        socket.on('sendProduct', function(data){
            console.log('Send product' + JSON.stringify(data));
            productUtil.saveProduct(data, function(productRes) {
                console.log(productRes);
                //io.to(data.socket_id).emit('getHistory', conversation);
            });

        });
    });
}


module.exports = socket;