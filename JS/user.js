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

function updateCloudStorageView() {

}

function login(userKeyStore, usernameStore, userEmailStore, userPasswordStore) {
	global_userKey = userKeyStore;
	global_username = usernameStore;
	global_userEmail = userEmailStore;
	global_password = userPasswordStore;

	displayCurrentUser(global_username);
	updateCloudStorageView(global_username);
}

function logout() {
	global_userKey = null;
	global_username = null;
	global_userEmail = null;
	global_password = null;

	displayCurrentUser();
}