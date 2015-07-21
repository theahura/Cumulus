/**
@author: Amol Kapoor
@date: 7-7-15
@version: 0.1

Handles incoming/outgoing server connections
*/

socket.on('serverToClient', function(data) {
	if(data.name === 'Error') {
		console.log(data.message);
		alert(data.message);
	}
	else if(data.name === 'loginSuccess') {
		console.log(data.userKey);
		alert("Logged in! " + data.userKey);

		login(data.userKey, data.username, data.email, data.password);
	}
	else if(data.name === 'loginFailure') {
		console.log(data.error)
		alert(data.error)
	}
	else if(data.name === 'newUserSuccess') {
		console.log(data.userKey);
		alert('New User Success! ' + data.userKey);
	}
	else if(data.name === 'newUserFailure') {
		console.log(data.error)
		alert(data.error)
	}
	else if(data.name === 'checkFileFailure') {
		console.log(data.error)
		alert(data.error)
	}
	else {
		alert("no name found");
	}
});