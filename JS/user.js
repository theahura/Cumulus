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
	$("#CurrentLogin").html(username);
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

}