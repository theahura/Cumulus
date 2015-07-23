/**
@author: Amol Kapoor
@date: 7-13-15
@version: 0.1

User profile functions
*/

var global_username;
var global_userEmail;
var global_password;

function displayCurrentUser(username) {
	if(username)
		$("#CurrentLogin").html("Logged in as: " + username);
	else
		$("#CurrentLogin").html("Not logged in");
}

function login(userKeyStore, usernameStore, userEmailStore, userPasswordStore) {
	global_baseAPI.setUserKey(userKeyStore);
	global_username = usernameStore;
	global_userEmail = userEmailStore;
	global_password = userPasswordStore;

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