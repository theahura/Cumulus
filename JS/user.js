/**
@author: Amol Kapoor
@date: 7-13-15
@version: 0.1

User profile functions
*/

var global_username;
var global_userEmail;

function errorHandler(data, isAppError) {
	console.log(data);
	alert(data.message);
}

function displayCurrentUser(username) {
	if(username)
		$("#CurrentLogin").html("Logged in as: " + username);
	else
		$("#CurrentLogin").html("Not logged in");
}

/**
	@param: data
		@param: username
		@param:email
		@param: userKey
*/
function login(data) {
	global_baseAPI.setUserKey(data.userKey.S);
	global_username = data.username.S;
	global_userEmail = data.email.S;

	displayCurrentUser(global_username);
	$(".prelogin-content").fadeOut( function() {	
		$(".postlogin-content").fadeIn();
	});
}

function logout() {
	global_baseAPI.setUserKey(null);
	global_username = null;
	global_userEmail = null;
	global_password = null;

	displayCurrentUser();
}