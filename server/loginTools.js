/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

User registration and login module 
*/


var bcrypt = require('bcrypt');



//Helper functions--------------------------------------------------------------------------------------------------

/**
	Takes username and password and generates a unique crypto hash that is extremely secure and uncrackable

	@param: username; string; username of the account
	@param: password; string; password for the account

	@return: userKey; unique key that allows a user to access data for their account
*/
function generateUserKey(username, password) {
	return bcrypt.hashSync(password, 10);
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
			callback(err);
		}
		else if(data.Item) {
			callback({message: 'Username already taken'}, 'appError');
		}
		else {
			callback();
		}
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
		@param: callback; function; the function to call if successfull login 
	*/
	loginUser: function(socket, table, incomingObj, callback) {
		// Read the item from the table
	  	table.getItem({Key: {'username':{'S':incomingObj.username}}}, function(err, data) {
	  		if(err) {
				callback(null, err);
			}	  		
			else {

	  			if(Object.keys(data).length === 0) {
	  				callback(null, {message: 'Username/Password incorrect'}, 'appError');
	  				return;
	  			}

				if(bcrypt.compareSync(incomingObj.password, data.Item.userKey.S)) {	  				

					dataObj = {};

					for(key in data.Item) {
						dataObj[key] = {};
						dataObj[key] = {'S':data.Item[key].S}
					}

		    		callback(dataObj);
		    	}
		    	else {
					callback(null, {message: 'Username/Password incorrect'}, 'appError');
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
	*/
	regNewUser: function(socket, table, incomingObj, callback) {
		checkUser(socket, table, incomingObj.username, function(err, isAppError) {

			if(err) { 
				callback(null, err, isAppError);
				return;
			}

			userKey = generateUserKey(incomingObj.username, incomingObj.password);

			dataObj = {};

			for(key in incomingObj) {
				if(key === 'name' || key === 'password')
					continue;

				dataObj[key] = {'S':incomingObj[key]};
			}

			dataObj['userKey'] = {'S': userKey};

			var itemParams = {Item: dataObj};
			
			table.putItem(itemParams, function(err, data) {
				if(err) {
					callback(null, err);
				}
				else {
					callback(dataObj);
				}
		    });
		});
	}
}
