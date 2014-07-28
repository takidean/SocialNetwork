jQuery(function( $ ) {
	'use strict';

	$('#register-btn').click( function() {
		$('.login-form').hide();
		$('.register-form').fadeIn();
	});
	$('#back-btn').click( function() {
		$('.register-form').hide();
		$('.login-form').fadeIn();
	});


	$('#user-submit').click(function() {
		var login = $('#user-login').val();
		var pass = $('#user-password').val();
		if(login!="" && pass!="") {
			$.post('/sn/index/login',{login:login,pass:pass},function(server_json){
				if(server_json.status==true) {
					location.reload();
				}
				else {alert('Wrong login or password')}
			},'json')
		}
	});

//    @FormParam("name") String name,
//        @FormParam("surname") String surname,
//        @FormParam("email") String login,
//        @FormParam("password") String password,
//        @FormParam("invite") String invite) {
//
    $('#register-btn2').click(function() {
        var name = $('#name').val();
        var surname = $('#surname').val();
        var position = $('#position').val(); 
        var email = $('#email').val();
        var pass = $('#pass').val();
        var invite = $('#invite').val();
        $.post('/sn/index/registration',{name:name,surname:surname,position:position,email:email,password:pass,invite:invite},function(server_json){
            if ( server_json.status == true ) {
                location.reload();
                $('#register-error-msg').hide();
            } else if ( server_json.status == false) {
				var msg = 'Server responded with error';
				$('#register-error-msg').text(msg).fadeIn(500);
            } else if ( server_json.status == 'wrongInviteCode' ) {
				var msg = 'Wrong invite code';
				$('#register-error-msg').text(msg).fadeIn(500);
            } else if ( server_json.status == 'wrongLoginPass' ) {
				var msg = 'Wrong login or password';
				$('#register-error-msg').text(msg).fadeIn(500);
            }
        },'json');
    });


	$('#exit').click('click', function() {
		$.get('/sn/user' +getUserId()+ '/exit', {}, function(response){
			if( response.status == true ) {
				location.reload();	
			}
		},'json')
	});



	$('#wall-submit').on('click', function(event){
		event.preventDefault();
		var msg = $('#wall-message').val();
		if( msg == '') return;
		$.post('/sn/user' +getUserId()+ '/createPost', {msg:msg}, function(response){
			if( response.status == true) {
				location.reload();
			}
		});
	});

	$('#wall-message').on('change keyup', function(){
		if ( $('#wall-message').val() == '' ) {
			$('#wall-submit').addClass('inactive');
		} else {
			$('#wall-submit').removeClass('inactive');
		}
	});







	function formatDate(msec) {
		var date = new Date(msec);
		var formated = 'at ' + date.getHours() + ':' + date.getMinutes() + ' on ' + date.getDate() + '.' + date.getMonth()+1 + '.' + date.getFullYear();
		return formated;
	};

	function getUserId() {
		var url = window.location.href;
		var pos = url.indexOf('user');
		if ( pos == -1) {
			var id = $.cookie("userId");
			return id;
		}
		var id = url.slice(pos+4);
		return id;
		// var userId = $.cookie("userId");
		// var id = (urlId != userId ) ? urlId : userId;
		// console.log(' id - '+ id);
		// return id;
	}





	function setupHomePage() {
		console.log('Setup Home');
		var fullname = '';
		var position = '';
		$.getJSON('/sn/user'+ getUserId() +'/getUser', {}, function(json) {
			$('#user-name').text( json.name );
			$('#user-surname').text( json.surname );
			$('#user-position').text( json.position );
			fullname = json.name + ' ' + json.surname;
		});

		$.getJSON('/sn/user' +getUserId()+ '/interests', {}, function(json) {
			var str = [];
			for (var i = 0; i < json.interests.length; i++) {
				str.push( json.interests[i].interest );
			};
			str = str.join(', ');
			$('#user-hobbies').text( str );
		});


		$.getJSON('/sn/user' + getUserId()+ '/posts0' , {}, function(json) {
			for (var i = 0; i < json.posts.length; i++) {
				var node = '<div class="post">';
					node += '<div class="post-photo">';
					node +=	'<a href="#">';
					node += '<img src="/assets/img/Mt-8_dgwlHM.jpg" alt="">';
					node += '</a>';
					node += '</div>';
					node += '<div class="post-message">';
					node += '<p class="post-name"><a href="">' + fullname + '</a></p>';
					node +=	'<p>' +json.posts[i].post+ '</p>';
					node += '<span class="post-meta">'+formatDate( json.posts[i].time )+'</span>';
					node += '</div>';
					node += '</div>';
					$('#wall').append( node );
			};
		});
	}

	function setupMessagesPage() {
		console.log('Setup Home');
		$.getJSON('ajax/messages.json', {}, function(json) {
		// $.getJSON('rest/', {}, function(json) {
			//CODE FOR HOME;
		});C	}

	function setupColleaguesPage() {
		console.log('Setup Colleagues');
		// $.getJSON('ajax/users.json', {}, function(json) {
		$.getJSON('/sn/workers/getWorkers0', {}, function (json) {
			var list = '<ul>';
			for (var i = 0; i < json.users.length; i++) {
				list += '<li class="user-entry">';
				list += '<div class="textual">';
				list += '<div class="user-name"><a href="/sn/user'+ json.users[i].id+'"><span></span>' + json.users[i].name + ' '+ json.users[i].surname +'</a></div>';
				list += '<div class="user-position"><span>Position </span>' + json.users[i].position + '</div>';
				list += '</li>';
			};
			list += '</ul>';
			$('#listOfUsers').append( $(list) );
		});
	};

// /sn/user+id

	function determinePage() {
		var pageId = $('body').attr('id');
		switch(pageId) {
			case 'home': 
				console.log('Home-page detected');
				setupHomePage();
				break;
			case 'colleagues':
				console.log('Сolleagues-page detected');
				setupColleaguesPage();
				break;
			case 'messages':
				console.log('Messages-page detected');
				setupMessagesPage();
				break;
			default:
				console.log('Custom-page detected');
		}
	}

	determinePage();





	function updateMessages() {
		// $.get('ajax/message.json', function(response){
		// 	if ( response.new == true ) {
		// 		console.log('new Message');
		// 	}
		// });
	}
	function updateFriends() {
		// $.get('ajax/friend.json', function(response){
		// 	if ( response.new == true ) {
		// 		console.log('new Friend');
		// 	} 
		// });
	}

	setInterval( function(){ updateMessages(); } , 5000);
	setInterval( function(){ updateFriends(); } , 10000);




/*	var $wrapper = $(".main-section"),
		$header = $(".main-header"),
		$footer = $(".main-footer");

	$(window).on("resize load", function(){
		var hh = $header.outerHeight(),
			fh = $footer.outerHeight(),
			wh = $(window).height();

		$wrapper.css({
			"min-height" : function(){
				return wh-fh-hh;
			}
		});
	});*/
});