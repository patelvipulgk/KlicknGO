$(function() {
    /*================================================================================================================================>*/ 
    /*======================================================== General Area ==========================================================>*/ 
    /*================================================================================================================================>*/ 

    var notReadMessageUserIds = [];
    idleTimer = null;
    idleState = false;
    idleWait = 5000; 
    (function ($) {
        $(document).ready(function () {
            $('*').bind('mousemove keydown scroll', function () {
                clearTimeout(idleTimer);
                if (idleState == true) {
                    socket.emit('setOnline', data2.id);
                } 
                
                idleState = false;
                idleTimer = setTimeout(function () { 
                    socket.emit('setAway', data2.id);
                    idleState = true; }, idleWait);
            });
            $("body").trigger("mousemove");
        });
    }) (jQuery)

    socket.on('getRecentMsgForNotificationBox', function(userList) { 
        var data = JSON.parse(JSON.stringify(userList));
        if(data.length >0) {
        var is_open = $('.messagebox').parents('div').hasClass('open'); 
        if(is_open) {
            $.ajax({ 
                url: '?r=socket/recent-message-user-information',
                type: 'POST',
                data: {post: data},
                async:false,
                beforeSend: function() {                    
                    var sparent=$(".msg-list.not-area .tab-pane#recent-messages");
                    setLoaderImg(sparent);                  
                    setOpacity(sparent.find('.loading-holder'),0);
                },
                success: function(data) {
                    var sparent=$(".msg-list.not-area .tab-pane#recent-messages");
                    removeLoaderImg(sparent);                   
                    setOpacity(sparent.find('.loading-holder'),1);

                    var users = JSON.parse(data);
                    $('#recent-messages ul.msg-listing').addClass('isloaded');
                    if(users.length === 0) {
                        $liBox = $('<li class="label-notice"><div class="no-listcontent">No Recent Messages Found.</div></li>');
                        $('#recent-messages ul.msg-listing').html($liBox);
                    } else {
                        $('#recent-messages ul.msg-listing').html('');
                        $.each(users, function(i, item) {
                            var fullname = item.fullname;
                            var id = item.from_id;
                            var $msgid = item._id;
                            var is_send = '';

                            var isreadcls = '';
                            var setUnread = '<i class="fa fa-dot-circle-o"></i>';

                            if(id == data2.id) {
                                id = item.to_id;
                                is_send = '<i class="fa fa-mail-reply"></i>';
                                isreadcls = 'read';
                                setUnread = '';
                            }

                            var thumbnail = item.information.thumbnail;
                            var status = item.status;
                            var $msg = item.reply;
                            var is_read = item.is_read;
                            var $preview='';
                            var $notificationMsg='';
                            var $type=item.type;

                            if($type == 'image') {
                                $preview = '<div class="chat-img-wrapper"><div class="imgholder"><img class="chat-img himg" src="'+$msg+'"></div></div>'; 
                                 $notificationMsg = "<i class='fa fa-image'></i> you sent a photo.";
                            } else {
                                $notificationMsg = $.emoticons.replace($msg);
                            }
                            
                            if(setUnread != '' && is_read == 1) {
                                isreadcls = '';
                            } else if(setUnread != '' && is_read == 0) {
                                isreadcls = 'read';
                            }

                            $liBox = $('<li class="'+isreadcls+' mainli recid'+id+'" data-msgid='+$msgid+'><div class="msg-holder"><a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+id+'" id="'+id+'"><span class="img-holder"><img class="img-responsive" src="'+thumbnail+'"></span><span class="desc-holder"><span class="uname">'+fullname+'</span><span class="desc">'+is_send+' '+$notificationMsg+'</span><span class="time-stamp">11:40 pm</span></span></a>'+$preview+'<a class="readicon" onclick="setReadUnread(this),markRead(this);" title="Mark as read" href="javascript:void(0)">'+setUnread+'</a><div class="clear"></div></div></li>');
                            $('#recent-messages ul.msg-listing').prepend($liBox);                                
                        
                        });
                    }
                    
                    fixImageUI('not-messages');
                },
                complete: function() {                  
                    var sparent=$(".msg-list.not-area .tab-pane#recent-messages");
                    removeLoaderImg(sparent);                   
                    setOpacity(sparent.find('.loading-holder'),1);
                }
            });
        }
      } else {
        var sparent=$(".msg-list.not-area .tab-pane#recent-messages");
        removeLoaderImg(sparent);                   
        setOpacity(sparent.find('.loading-holder'),1);
        
        $liBox = $('<li class="label-notice"><div class="no-listcontent">No Recent Messages Found.</div></li>');
                        $('#recent-messages ul.msg-listing').html($liBox);
      }
    });

    socket.on('sendMessageToSelf', function($data) { 
        if(!$.isEmptyObject($data)) {
            var $msgId = $data._id;
            var $type = $data.type;
            var $category = $data.category;
            var $from_id = $data.from_id;
            var $to_id = $data.to_id;
            var $thumb = $data.thumbnail;
            var $fullname = $data.fullname;
            var $msg = $data.reply;
            var $datetime = $data.created_at;
            var $datetimedisplay = new Date($datetime);
            var $time = getTimeWithAMPM($datetimedisplay);
            var $getDate = $datetimedisplay.getDate();
            var $getMonth = $datetimedisplay.getMonth();
            var $getFullYear = $datetimedisplay.getFullYear();
            var $currentDateTime = new Date();
            var $preview='';

            var $notificationMsg='';

            if($type == 'image') {
                $preview = '<div class="chat-img-wrapper"><div class="imgholder"><img class="chat-img himg" src="'+$msg+'"></div></div>'; 
                $msg = '<div class="msg-img"> <figure data-pswp-uid="1"><a href="'+$msg+'" data-size="1600x1600" data-med="'+$msg+'" data-med-size="1024x1024" data-author="Folkert Gorter"><img src="'+$msg+'"></a><a href="'+$msg+'" class="download" download><i class="fa fa-download"></i></a> </figure></div>';
                $notificationMsg = "<i class='fa fa-mail-reply'></i>&nbsp;&nbsp;<i class='fa fa-image'></i> you sent a photo.";
            } else if($type == 'gift') {
                $text = '';
                $code = '';
                $msgsplit = $msg.toString().split('|||||||');
                if($msgsplit[0] != undefined) {
                    $code = $msgsplit[0];
                }
                if($msgsplit[1] != undefined) {
                    $text = $.emoticons.replace($msgsplit[1]);
                }
                $msg = '<div class="gift-img"><p>'+$text+'</p> <a href="javascript:void(0)" onclick="useGift(\''+$code+'\', \'popular\', \'preview\', \'message\')"> <i class="fa fa-gift"></i></a></div>';
                $notificationMsg = "<i class='fa fa-mail-reply'></i>&nbsp;&nbsp;<i class='fa fa-gift'></i> you sent a gift.";
            } else {
                $msg = $.emoticons.replace($msg);
                $notificationMsg = '<i class="fa fa-mail-reply sd"></i> '+$msg;
            }
        
            // check Message box and check box is exist or not...
            if($type == 'gift') {
                if($currentDateTime.getFullYear() == $getFullYear) {
                    var $datetimedisplay = ('0' + ($getMonth + 1)).slice(-2) + "/" + ('0' + $getDate).slice(-2) + ' ' +$time;                    
                } else {
                    var $datetimedisplay = ('0' + ($getMonth + 1)).slice(-2) + "/" + ('0' + $getDate).slice(-2) + "/" + $getFullYear + ' ' +$time;
                }
                $.each($to_id, function(i, v) {
                    if (window.location.href.indexOf("messages") > -1) {
                        // Check Message Box is Availabel or not....
                        $this1 = $('.right-section').find('ul.current-messages').find('li#li_msg_'+v);
                        if($this1.length) {

                            // check Today Label Exist.....
                            var isTodayLabelExist = $this1.find('ul.outer').find('li.date-divider:last');

                            var label = '';
                            if( isTodayLabelExist.length ) {
                                var existlabel = isTodayLabelExist.find('span').html().trim();
                                if(existlabel == 'Today') {
                                    label = '';
                                } else {
                                    label = '<li class="date-divider"><span>Today</span></li>';
                                }
                            } else {
                                label = '<li class="date-divider"><span>Today</span></li>';
                            }

                            $messageBox = $(label+'<li class="msgli received"><div class="checkbox-holder"><div class="h-checkbox entertosend msg-checkbox"><input type="checkbox" name="deleteselectedmsg" value="'+$msgId+'"><label>&nbsp;</label></div></div><div class="msgdetail-box"><div class="imgholder"><img src="profile/'+$thumb+'"></div><div class="descholder"><h6>'+$fullname+'</h6><p>'+$msg+'</p><span class="timestamp">'+$datetimedisplay+'</span></div></div></li>');
                            $this1.find('ul.outer').append($messageBox);
                        }
                    }

                    // Check Chat Box is Availabel or not....
                    var $this2 = $('.chat-section').find('.chat-window').find('ul.mainul').find('li#li-'+v);
                    if($this2.length) {
                        if($this2.find('ul.outer').find('li').length) {
                            if($this2.find('ul.outer').find('li.chatli:last').hasClass('received')) {
                                $chatbox = $(label+'<li class="chatli"><ul class="submsg"><li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div></li></ul> </li>');
                                $this2.find('ul.outer').append($chatbox);
                            } else {
                                $chatbox = $(label+'<li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div></li>');
                                $this2.find('ul.outer').find('li.chatli:last').find('ul.submsg').append($chatbox);
                            }
                        } else {
                            $chatbox = $(label+'<li class="chatli"> <ul class="submsg"><li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div> </li></ul></li>');
                            $this2.find('ul.outer').html($chatbox);
                        }    
                    }
                });

                    
                // Update Message Notification Update list
                if($to_id) {
                    $.ajax({ 
                        url: '?r=socket/get-info-for-single',
                        type: 'POST',
                        data: {id: $to_id},
                        async: true,
                        success: function(response) {
                            var $response = $.parseJSON(response);
                            if($response.length >0) {
                                var $otherid = $response._id;
                                var $otherthumb = $response.thumbnail;
                                var $othername = $response.fullname;
                                $('#recent-messages').find('.msg-listing').find('li.recid'+$otherid).remove();
                                var $liBox = $('<li class="read mainli recid'+$otherid+'"> <div class="msg-holder"> <a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+$otherid+'" id="'+$otherid+'"> <span class="img-holder"> <img class="img-responsive" src="'+$otherthumb+'"> </span> <span class="desc-holder"><span class="uname">'+$othername+'</span><span class="desc">'+$notificationMsg+'</span><span class="time-stamp">'+$time+'</span> </span></a>'+$preview+'<a class="readicon" onclick="markRead(this)" title="Mark as read" href="javascript:void(0)"></a><div class="clear"></div></li>'); 
                                
                               $('#recent-messages').find('ul.msg-listing').prepend($liBox);
                               fixImageUI('not-messages');
                               initNiceScroll(".nice-scroll"); 
                            }
                        }
                    });     
               }
            } else {
                if (window.location.href.indexOf("messages") > -1)  {
                    // check message box is available or not...
                    var $this1 = $('.right-section').find('ul.current-messages').find('li#li_msg_'+$to_id);
                    if($this1.length) {
                        if($currentDateTime.getFullYear() == $getFullYear) {  
                            var $datetimedisplay = ('0' + ($getMonth + 1)).slice(-2) + "/" + ('0' + $getDate).slice(-2) + ' ' +$time;                    
                        } else {
                            var $datetimedisplay = ('0' + ($getMonth + 1)).slice(-2) + "/" + ('0' + $getDate).slice(-2) + "/" + $getFullYear + ' ' +$time;
                        }

                        // check Today Label Exist.....
                        var isTodayLabelExist = $this1.find('ul.outer').find('li.date-divider:last');

                        var label = '';
                        if( isTodayLabelExist.length ) {
                            var existlabel = isTodayLabelExist.find('span').html().trim();
                            if(existlabel == 'Today') {
                                label = '';
                            } else {
                                label = '<li class="date-divider"><span>Today</span></li>';
                            }
                        } else {
                            label = '<li class="date-divider"><span>Today</span></li>';
                        }

                        $messageBox = $(label+'<li class="msgli received"><div class="checkbox-holder"><div class="h-checkbox entertosend msg-checkbox"><input type="checkbox" name="deleteselectedmsg" value="'+$msgId+'"><label>&nbsp;</label></div></div><div class="msgdetail-box"><div class="imgholder"><img src="profile/'+$thumb+'"></div><div class="descholder"><h6>'+$fullname+'</h6><p>'+$msg+'</p><span class="timestamp">'+$datetimedisplay+'</span></div></div></li>');
                        $this1.find('ul.outer').append($messageBox);
                    }
                }

                // check chat box is available or not...
                var $this2 = $('.chat-section .chat-window ul.mainul').find('li#li-'+$to_id);
                if($this2.length) {
                    if($this2.find('ul.outer').find('li').length) {
                        if($this2.find('ul.outer').find('li.chatli:last').hasClass('received')) {
                            $chatbox = $(label+'<li class="chatli"><ul class="submsg"><li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div></li></ul> </li>');
                            $this2.find('ul.outer').append($chatbox);
                        } else {
                            $chatbox = $(label+'<li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div></li>');
                            $this2.find('ul.outer').find('li.chatli:last').find('ul.submsg').append($chatbox);
                        }
                    } else {
                        $chatbox = $(label+'<li class="chatli"> <ul class="submsg"><li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div> </li></ul></li>');
                        $this2.find('ul.outer').html($chatbox);
                    }    
                }

                if($to_id) {
                    $.ajax({ 
                        url: '?r=socket/get-info-for-single',
                        type: 'POST',
                        data: {id: $to_id},
                        async: true,
                        success: function(response) {
                            var $response = $.parseJSON(response);
                            if(!$.isEmptyObject($response)) {
                                var $otherthumb = $response.thumbnail;
                                var $othername = $response.fullname;
                                $('#recent-messages').find('.msg-listing').find('li.recid'+$to_id).remove();
                                var $liBox = $('<li class="read mainli recid'+$to_id+'"> <div class="msg-holder"> <a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+$to_id+'" id="'+$to_id+'"> <span class="img-holder"> <img class="img-responsive" src="'+$otherthumb+'"> </span> <span class="desc-holder"><span class="uname">'+$othername+'</span><span class="desc">'+$notificationMsg+'</span><span class="time-stamp">'+$time+'</span> </span></a>'+$preview+'<a class="readicon" onclick="markRead(this)" title="Mark as read" href="javascript:void(0)"></a><div class="clear"></div></li>'); 
                                   $('#recent-messages ul.msg-listing').prepend($liBox);
                                fixImageUI('not-messages');
                                initNiceScroll(".nice-scroll"); 
                            }
                        }
                    });     
               }
            }
            
            scrollChatBottom();
            scrollMessageBottom();
            initGalleryImageSlider();       
        }
    });

    socket.on('sendMessageToOther', function($result) {
        if(!($.isEmptyObject($result))) {
            $id = $result.from_id;
            if($id == data2.id) {
                $id = $result.to_id;
            }
            var is_display = true;           
            
            $.ajax({
                type: 'POST',
                url: '?r=socket/check-is-mute', // update if user is in archived and also check is mute user ot not..
                data: {
                    id: $id
                },
                success: function(data) {
                    data = JSON.parse(data);
                    if(data.status != undefined && data.status) {
                        is_display = false;
                    }
                    var $data = JSON.parse(JSON.stringify($result));
                    var $msgid = $data._id;
                    var $from_id = $data.from_id;
                    var $to_id = $data.to_id;
                    var $thumb = $data.thumbnail;
                    var $fullname = $data.fullname;
                    var $msg = $data.reply;
                    var $type = $data.type;
                    var $category = $data.category;
                    var $preview='';
                    var $notificationMsg='';
                    var $datetime = $data.created_at;
                    var $datetimedisplay = new Date($datetime);
                    var $time = getTimeWithAMPM($datetimedisplay);
                    var $currentDateTime = new Date();

                    if(is_display == false) {
                        isReadMessage($data.from_id);
                    }

                    if($type == 'image') {
                         $preview = '<div class="chat-img-wrapper"><div class="imgholder"><img class="chat-img himg" src="'+$msg+'"></div></div>'; 
                         $msg = '<div class="msg-img"> <figure data-pswp-uid="1"><a href="'+$msg+'" data-size="1600x1600" data-med="'+$msg+'" data-med-size="1024x1024" data-author="Folkert Gorter"><img src="'+$msg+'"></a><a href="'+$msg+'" class="download" download><i class="fa fa-download"></i></a> </figure></div>';
                         $notificationMsg = "<i class='fa fa-image'></i> You received a photo.";
                    } else if($type == 'gift') {
                        $text = '';
                        $code = '';
                        $msgsplit = $msg.toString().split('|||||||');
                        if($msgsplit[0] != undefined) {
                            $code = $msgsplit[0];
                        }
                        if($msgsplit[1] != undefined) {
                            $text = $.emoticons.replace($msgsplit[1]);
                        }
                        $msg = '<div class="gift-img"><p>'+$text+'</p> <a href="javascript:void(0)" onclick="useGift(\''+$code+'\', \'popular\', \'preview\', \'message\')"> <i class="fa fa-gift"></i></a></div>';
                        $notificationMsg = "<i class='fa fa-gift'></i> You received a gift.";
                    } else {        
                        $msg = $.emoticons.replace($msg);
                        $notificationMsg = $msg;
                    }

                                    
                    // check message notification box top is open or not if it is open then not display red count in recent box is set isread with query..
                    if($('.not-messages .dropdown.dropdown-custom').hasClass('open')) {
                        is_display = false;
                    }
        

                    if($category != 'others') {                
                        $('#recent-messages .msg-listing').find('li.recid'+$from_id).remove();
                        $('#recent-messages .msg-listing').find('li.label-notice').remove();
                        var $liBox = $('<li class="mainli recid'+$from_id+'"><div class="msg-holder"><a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+$from_id+'" id="'+$from_id+'"><span class="img-holder"><img class="img-responsive" src="profile/'+$thumb+'"></span><span class="desc-holder"><span class="uname">'+$fullname+'</span><span class="desc">'+$notificationMsg+'</span><span class="time-stamp">'+$time+'</span></span></a>'+$preview+'<a class="readicon" onclick="setReadUnread('+$from_id+'),markRead(this); " title="Mark as read" href="javascript:void(0)"><i class="fa fa-dot-circle-o"></i></a><div class="clear"></div></div></li>');
                        $('#recent-messages ul.msg-listing').prepend($liBox);  
                    }

                    // Message Notification Update..
                    if($('.right-section').find('ul.current-messages').find('li.parentli-'+$from_id).hasClass('active')) {
                        is_display = false;
                        isReadMessage($from_id);
                    }

        
                    // check user li exist in active tab in message leftside for change background color for idenitify that new message arrive.
                    $xfsLi = $('.left-section').find('.tab-content').find('div.tab-pane.active');
                    if($xfsLi.length) {
                        var $cateTemp = $xfsLi.attr('id');
                        if($cateTemp == 'messages-'+$category) {
                            var $ExistLi = $xfsLi.find('ul.users-display');
                            if($ExistLi.find('li.label-notice').length) {
                                $ExistLi.find('li.label-notice').remove();
                            }
                        
                            if(!$ExistLi.find('li').find('a#msg_'+$id).length) {
                                var tempcls = '';
                                if(!$ExistLi.find('li').length) {
                                    tempcls = 'active';
                                }
                                $tempLi = '<li><a href="javascript:void(0)" class="'+tempcls+'" id="msg_'+$id+'" onclick="openMessage(this); messageLiClicked(this);"><span class="muser-holder"> <span class="imgholder"><img src="profile/'+$thumb+'"></span><span class="descholder"><h6>'+$fullname+'</h6><p>'+$msg+'</p><span class="timestamp">'+$time+'</span><span class="newmsg-count">1</span></span></span></a></li>';
                                $($xfsLi).find('ul.users-display').prepend($tempLi);


                                if(tempcls == 'active') {
                                    $ExistLi.find('li').find('a.active').trigger( 'click' );
                                }
                            }
                        }
                    }


            
                    if($xfsLi.find('ul.users-display').find('li').find('a#msg_'+$id).hasClass('active')) {
                        is_display = false;
                        isReadMessage($from_id);       
                    } else {
                        var existcount = $($xfsLi).find('.descholder').find('.newmsg-count').html();
                        if(existcount != undefined) {
                            existcount = existcount.replace('new', '');
                            if(existcount >0) {
                                existcount++;
                            } else {
                                existcount = 1;
                            }
                            $($xfsLi).removeClass('unread-msg');
                            $($xfsLi).addClass('unread-msg');
                            $($xfsLi).find('.descholder').find('.newmsg-count').html(existcount + ' new');
                        }
                    }

                    if($('.chat-section .chat-window ul.mainul').find('li#li-'+$from_id).hasClass('active')) {
                        is_display = false;
                        isReadMessage($from_id);
                    }
                    
                    if(is_display == true) {
                        audio = new Audio();
                        audio.src = 'images/msgtn.mp3';
                        audio.play(); 

                        var $this = $(".not-messages .dropdown a.dropdown-toggle").find('#msg_budge');
                        $this.css('display', 'block');
                        var existVal = $this.html();
                        if(existVal >0) {
                            $this.html(existVal++);
                        } else {
                            $this.html(1);
                        }
                    }

                    // check Message is exist or not...
                    if($('.right-section ul.current-messages').find('li#li_msg_'+$from_id).length) {

                        // check Today Label Exist.....
                        var isTodayLabelExist = $('.right-section').find('ul.current-messages').find('li#li_msg_'+$from_id).find('ul.outer').find('li.date-divider:last');

                        var label = '';
                        if( isTodayLabelExist.length ) {
                            var existlabel = isTodayLabelExist.find('span').html().trim();
                            if(existlabel == 'Today') {
                                label = '';
                            } else {
                                label = '<li class="date-divider"><span>Today</span></li>';
                            }
                        } else {
                            label = '<li class="date-divider"><span>Today</span></li>';
                        }

                        if($currentDateTime.getFullYear() == $datetimedisplay.getFullYear()) {
                            var $datetimedisplay = ('0' + ($datetimedisplay.getMonth()+1)).slice(-2) + "/" + ('0' + $datetimedisplay.getDate()).slice(-2) + ' ' +$time;
                            
                        } else {

                            var $datetimedisplay = ('0' + ($datetimedisplay.getMonth()+1)).slice(-2) + "/" + ('0' + $datetimedisplay.getDate()).slice(-2) + "/" + $datetimedisplay.getFullYear() + ' ' +$time;
                        }

                        $messageBox = $(label+'<li class="msgli received"><div class="checkbox-holder"><div class="h-checkbox entertosend msg-checkbox"><input type="checkbox" name="deleteselectedmsg" value="'+$msgid+'"><label>&nbsp;</label></div></div><div class="msgdetail-box"><div class="imgholder"><img src="profile/'+$thumb+'"></div><div class="descholder"><h6>'+$fullname+'</h6><p>'+$msg+'</p><span class="timestamp">'+$datetimedisplay+'</span></div></div></li>');
                        $('.right-section ul.current-messages').find('li#li_msg_'+$from_id).find('ul.outer').append($messageBox);
                    }

                    // check Chat Box is exist or not...
                    var $this = $('.chat-window').find('ul.mainul').find('li#li-'+$from_id);
                    if($this.length) {
                        if($this.find('ul.outer').find('li').length) {
                            if($this.find('ul.outer').find('li.chatli:last').hasClass('received')) {
                                $chatbox = $(label+'<li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div></li>');
                                $this.find('ul.outer').find('li.received:last').find('ul.submsg').append($chatbox);
                            } else {
                                $chatbox = $(label+'<li class="chatli received"><div class="imgholder"><img src="profile/'+$thumb+'"></div><ul class="submsg"><li><div class="msgholder">'+$msg+'</div><div class="timestamp">'+$time+'</div></li></ul> </li>');
                                $this.find('ul.outer').append($chatbox);
                            }
                        } else {
                            $chatbox = $(label+'<li class="chatli received"><div class="imgholder"><img src="profile/'+$thumb+'"></div><ul class="submsg"><li><div class="msgholder">'+$msg+'</div> <div class="timestamp">'+$time+'</div> </li></ul> </li>');
                            $this.find('ul.outer').html($chatbox);
                        }    
                    }


                    //initNiceScroll(".nice-scroll");
                    scrollChatBottom();
                    scrollMessageBottom();
                    initGalleryImageSlider();
                    fixImageUI('not-messages');
                }
            });            
        }
    });  

    /*================================================================================================================================>*/ 
    /*======================================================== Chat Area ==========================================================>*/ 
    /*================================================================================================================================>*/ 

    socket.on('getSelfUserList', function(userList) {
        if(userList.length != 0) {
            $.ajax({
                url: '?r=socket/for-self',
                type: 'POST',
                data: {userList}, 
                async:false,
                success: function(data) {
                    var $users = JSON.parse(data);
                    $frdtab = $("#chat-friends").find('.nice-scroll');
                    $frdtab.html('');
                    
                    // Remove Loader.......
                    var sparent=$(".float-chat .data-loading");
                    removeLoaderImg(sparent);
                    setOpacity(sparent.find('.loading-holder'),1);             
                    
                    if($users.length === 0) {
                        $liBox = $("<ul class='chat-ul'><li class='label-notice'><div class='no-listcontent'>No record found.</div></li></ul>");
                        $frdtab.html($liBox);
                    } else {
                        $.each($users, function(k, item) {       
                            var $id = item.id;
                            var $fullname = item.fullname;
                            var $status = item.status;
                            var $thumbnail = item.thumbnail;
                            $liBox = $('<ul class="chat-ul chat-'+$status+' chatuserid_'+$id+'"><li class="chatuser-'+$id+'"><div class="chat-summery"><a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+$id+'" id="'+$id+'" class="atag"><span class="img-holder"><img src="'+$thumbnail+'"></span><span class="desc-holder"><span class="uname">'+$fullname+'</span></span></a></div></li></ul>');
                            $frdtab.append($liBox);
                        });
                    }
                }
            });
        } else {
            // Remove Loaader....
            var sparent=$(".float-chat .data-loading");
            removeLoaderImg(sparent);
            setOpacity(sparent.find('.loading-holder'),1);      

            // Put Nor Record Found Label..........
            $frdtab = $("#chat-friends").find('.nice-scroll');
            $liBox = $("<ul class='chat-ul'><li class='label-notice'><div class='no-listcontent'>No record found.</div></li></ul>");
            $frdtab.html($liBox);
        }
    });

    socket.on('getAnotherUserList', function(userList) {
        if(!($.isEmptyObject(userList))) {
            $.ajax({
                url: '?r=socket/for-all',
                type: 'POST',
                data: {userList},
                success: function(data) {
                    var user = JSON.parse(data);
                    if(user.length != 0) {
                        var whichActive = $(".chat-tabs").find(".tab-content").find('.fade.active');
                        if(whichActive.length) {
                            var activeId = whichActive.attr('id');
                            var id = user.id;
                            var status = user.status;
                            var cls = 'chat-'+status;
                            if(activeId == 'chat-friends' || activeId == 'chat-recent' || activeId == 'chat-search') {
                                whichActive.find('ul.chatuserid_'+id).removeClass().addClass('chat-ul '+ cls +' chatuserid_'+id);                              
                            } else if(activeId == 'chat-online') {
                                var current = whichActive.find('ul.chatuserid_'+id);
                                if(current.length) {
                                    current.remove();
                                    if(!whichActive.find('ul.chat-ul').length) {
                                        $liBox = $("<ul class='chat-ul chat-label-notice'><li class='label-notice'><div class='no-listcontent'>No memeber is online</div></li></ul>");
                                        whichActive.find('.nice-scroll').html($liBox);
                                    }
                                } else {
                                    var fullname = user.fullname;
                                    var thumbnail = user.thumbnail;
                                    $liBox = $('<ul class="chat-ul chat-online chatuserid_'+id+'" chat-ul"><li class="chatuser-'+id+'"><div class="chat-summery"><a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+id+'" id="'+id+'" class="atag"><span class="img-holder"><img src="'+thumbnail+'"></span><span class="desc-holder"><span class="uname">'+fullname+'</span></span></a></div></li></ul>');
                                    if(whichActive.find('.nice-scroll').find('ul.chat-label-notice').length) {
                                        whichActive.find('.nice-scroll').find('ul.chat-label-notice').remove();
                                    }
                                    whichActive.find('.nice-scroll').append($liBox);
                                }
                            }
                        }
                    }
                }
            });
        }    
    });

    socket.on('getOnline', function(userList) {
        if(userList.length) {
            $.ajax({
                url: '?r=socket/for-self',
                type: 'POST',
                data: {userList},
                async:false,
                success: function(data) {
                    var users = JSON.parse(data);
                    // Set Blank 
                    $frdtab = $(".chat-tabs").find(".tab-content").find("#chat-online").find('.nice-scroll');
                    $frdtab.html('');
                    if(users.length === 0) {
                        $liBox = $("<ul class='chat-ul chat-label-notice'><li class='label-notice'><div class='no-listcontent'>No memeber is online</div></li></ul>");
                        $frdtab.html($liBox);
                    } else {
                        var sparent=$(".float-chat .data-loading");
                        removeLoaderImg(sparent);
                        setOpacity(sparent.find('.loading-holder'),1); 

                        $.each(users, function(k, item) {       
                            var id = item.id;
                            var fullname = item.fullname;
                            var status = item.status;
                            var thumbnail = item.information.thumbnail;
                            $liBox = $('<ul class="chat-ul chat-'+status+' chatuserid_'+id+'" chat-ul"><li class="chatuser-'+id+'"><div class="chat-summery"><a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+id+'" id="'+id+'" class="atag"><span class="img-holder"><img src="'+thumbnail+'"></span><span class="desc-holder"><span class="uname">'+fullname+'</span></span></a></div></li></ul>');
                            $frdtab.append($liBox);
                        });
                    }
                }
            });
        } else {
            var sparent=$(".float-chat .data-loading");
            removeLoaderImg(sparent);
            setOpacity(sparent.find('.loading-holder'),1);    

            $frdtab = $(".chat-tabs").find(".tab-content").find("#chat-online").find('.nice-scroll');
            $liBox = $("<ul class='chat-ul chat-label-notice'><li class='label-notice'><div class='no-listcontent'>No memeber is online</div></li></ul>");
            $frdtab.html($liBox);
        } 
    });

    socket.on('chatboxsearchresult', function(result) {
        var result = JSON.parse(JSON.stringify(result));
        if(result) {
            var $selectorAll = $('.chat-tabs .tab-content').find('#chat-search');
            $selectorAll.html('');

            $selectorAll.append('<span class="ctitle">Recent</span><div class="nice-scroll recentchat-scroll"></div>');

            $.each(result, function(i, item) {
                var fullname = item.fullname;
                var id = item.id;
                var thumbnail = item.thumb;
                var status = item.status;

                $liBox = $('<ul class="chat-'+status+' chat-ul chatuserid_'+id+'"><li class="chatuser-'+id+'"> <div class="chat-summery"> <a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+id+'" id="chat-'+id+'" class="atag"><span class="img-holder"><img src="'+thumbnail+'"></span> <span class="desc-holder"><span class="uname">'+fullname+'</span></span> </a> </div> </li> </ul>');
                $selectorAll.append($liBox);
            }); 
        }
    });

    socket.on('getChatUsersForRecentStatus', function(data) {
        var $result = JSON.parse(JSON.stringify(data));
        if($result) {
            $selectore = $('.chat-tabs').find('.tab-content').find('#chat-recent').find('.nice-scroll');
            if($selectore.length) {
                $selectore.html('');
                $.each($result, function(i, v) {
                    var $fullname = v.fullname,
                        $id = v.id,
                        $thumb = v.thumb,
                        $country = v.country;

                    $li = '<ul class="chat-ul chat-offline chatuserid_'+$id+'"><li class="chatuser-'+$id+'"><div class="chat-summery"><a href="javascript:void(0)" onclick="openChatbox(this); chatLiClicked(this);" data-id="chat_'+$id+'" id="'+$id+'" class="atag"><span class="img-holder"><img src="'+$thumb+'"></span><span class="desc-holder"><span class="uname">'+$fullname+'</span><span class="info">'+$country+'</span></span></a></div></li></ul>';

                    $selectore.append($li);
                });
            }
        }
    });

    /*================================================================================================================================>*/ 
    /*======================================================== Message Area ==========================================================>*/ 
    /*================================================================================================================================>*/ 
});   

    
 


    
    