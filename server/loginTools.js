/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

User registration and login module 
*/

//AWS dependency - not sure if needed? 
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

//Helper functions--------------------------------------------------------------------------------------------------

/**
	Takes username and password and generates a unique crypto hash that is extremely secure and uncrackable

	@param: username; string; username of the account
	@param: password; string; password for the account

	@return: userKey; unique key that allows a user to access data for their account
*/
function generateUserKey(username, password) {
	return username+password;
} 

/**
	Checks database if the current username is already taken. If so, sends newUserResponseFailure message. 

	@param: socket; socket.io socket; connection to send failure message to
	@param: table; dynamodb table; where to search for data
	@param: username; string; the username to search for 
	@param: callback; function; the function to call when the search is finished and successful
*/
function checkUser(socket, table, username, callback) {
	table.getItem({Key: {'username':{'S':username}}}, function(err, data)  {
		if(err) {
			newUserResponseFailure(socket, err);
		}
		else if(data.Item) {
			newUserResponseFailure(socket, {message: 'Username already taken'}, 'appError');
		}
		else {
			callback();
		}
	});
}

//Login Responses--------------------------------------------------------------------------------------------------

/**
	Function to emit data when user login fails

	@param: socket; socket.io socket; connection to send data to
	@param: data; {}; data to send
		@param: data.message; string; data message to send
	@param: extraKey; string; additional info to send about the error
*/
function loginResponseFailure(socket, data, extraKey) {
	console.log(data)
	socket.emit('serverToClient', {
		name: 'loginFailure',
		error: data.message,
		extraKey: extraKey
	});
}

/**
	See above.
*/
function newUserResponseFailure(socket, data, extraKey) {
	console.log(data)
	socket.emit('serverToClient', {
		name: 'newUserFailure',
		error: data.message,
		extraKey: extraKey
	});
}

/**
	Function to emit data when user login succeeds, or sends to failure if data is not correct. 

	On success, messages the userKey to the user

	@param: socket; socket.io socket; connection to send data to
	@param: data; {}; data to send
*/
function loginResponseSuccess(socket, data) {
	if(!data.Item) {
		loginResponseFailure(socket, {message: 'Username/Password not valid'});
		return;
	}

	socket.emit('serverToClient', {
		name: 'loginSuccess',
		userKey: data.Item.userKey.S, 
		username: data.Item.username.S,
		password: data.Item.password.S,
		email: data.Item.email.S,
		fullname: data.Item.fullname.S
	});
}

/**
	See above
*/
function newUserResponseSuccess(socket, data) {
	socket.emit('serverToClient', {
		name: 'newUserSuccess',
		userKey: data
	});
}


//Exposed functions
module.exports = {
	/**
		Logs the user in and runs proper checks, sending info back as appropriate (either error or userkey)

		@param: socket; socket.io socket; connection to send data to 
		@param: table; dynamodb table; where to search for login info
		@param: incomingObj; {}
			@param: username; string; username for account login
			@param: password; string; password for account login
		@param: callback; function; the function to call if successfull login (default = loginResponseSuccess)
		@param: callbackErr; function; the function to call if failed login (default = loginResponseFailure)
	*/
	loginUser: function(socket, table, incomingObj, callback, callbackErr) {
		if(!callbackErr)
			callbackErr = loginResponseFailure;

		if(!callback)
			callback = loginResponseSuccess;

		// Read the item from the table
	  	table.getItem({Key: {'username':{'S':incomingObj.username}}}, function(err, data) {
	  		if(err) {
				callbackErr(socket, err);
			}	  		
			else {

	  			if(Object.keys(data).length === 0) {
	  				callbackErr(socket, {message: 'Username/Password not valid'}, 'appError');
	  				return;
	  			}

	  			if(data.Item.password.S === incomingObj.password) {
		    		callback(socket, data); // print the item data	  	
		    	}
		    	else {
					callbackErr(socket, {message: 'Username/Password not valid'}, 'appError');
					return;
		    	}	
	  		}
	  	});
	}, 

	/**
		Creates new account and runs proper checks, sending info back as appropriate (either error or userkey)

		@param: socket; socket.io socket; connection to send data to 
		@param: table; dynamodb table; where to search for login info
		@param: incomingObj; {}
			@param: username; string; username for account login
			@param: password; string; password for account login
		@param: callback; function; the function to call if successfull login (default = loginResponseSuccess)
		@param: callbackErr; function; the function to call if failed login (default = loginResponseFailure)
	*/
	regNewUser: function(socket, table, incomingObj, callback, callbackErr) {
		checkUser(socket, table, incomingObj.username, function() {
			userKey = generateUserKey(incomingObj.username, incomingObj.password);

			dataObj = {};

			for(key in incomingObj) {
				if(key === 'name')
					continue;

				dataObj[key] = {'S':incomingObj[key]};
			}

			dataObj['userKey'] = {'S': userKey};

			var itemParams = {Item: dataObj};
			
			table.putItem(itemParams, function(err, data) {
				if(err) {
					if(!callbackErr)
						callbackErr = newUserResponseFailure;
					callbackErr(socket, err);
				}
				else {
					if(!callback)
						callback = newUserResponseSuccess;
					callback(socket, userKey);
				}
		    });
		});
	}
}
