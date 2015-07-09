/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

User registration and login module 
*/
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

//helpers
function generateUserKey(username, password)
{
	return username+password;
} 

function checkUser(socket, table, username, callback)
{
	table.getItem({Key: {'username':{'S':username}}}, function(err, data) 
	{
		if(err)
		{
			console.log(err)
			newUserResponseFailure(socket, err);
		}
		else if(data.Item)
		{
			newUserResponseFailure(socket, {message: 'Username already taken'}, 'appError');
		}
		else
		{
			callback();
		}
	});
}

//login responses

function loginResponseFailure(socket, data, extraKey)
{
	socket.emit('serverToClient', {
		name: 'loginFailure',
		error: data.message,
		extraKey: extraKey
	});
}

function loginResponseSuccess(socket, data)
{
	if(!data.Item)
	{
		loginResponseFailure(socket, {message: 'Username/Password not valid'});
		return;
	}

	socket.emit('serverToClient', {
		name: 'loginSuccess',
		userKey: data.Item.userKey.S
	});
}

function newUserResponseFailure(socket, data, extraKey)
{
	socket.emit('serverToClient', {
		name: 'newUserFailure',
		error: data.message,
		extraKey: extraKey
	});
}

function newUserResponseSuccess(socket, data)
{
	socket.emit('serverToClient', {
		name: 'newUserSuccess',
		userKey: data
	});
}

module.exports = 
{
	loginUser: function(socket, table, incomingObj, callback, callbackErr)
	{
		// Read the item from the table
	  	table.getItem({Key: {'username':{'S':incomingObj.username}, 'password':{'S':incomingObj.password}}}, function(err, data) 
	  	{
	  		if(err)
			{
				if(!callbackErr)
					callbackErr = loginResponseFailure;
				callbackErr(socket, err);
			}	  		
			else
	  		{
	  			if(!callback)
	  				callback = loginResponseSuccess;
	    		callback(socket, data); // print the item data	  		
	  		}
	  	});
	}, 

	regNewUser: function(socket, table, incomingObj, callback, callbackErr)
	{
		checkUser(socket, table, incomingObj.username, function()
		{
			userKey = generateUserKey(incomingObj.username, incomingObj.password);

			dataObj = {};

			for(key in incomingObj)
			{
				if(key === 'name')
					continue;

				dataObj[key] = {'S':incomingObj[key]};
			}

			dataObj['userKey'] = {'S': userKey};

			var itemParams = {Item: dataObj};
			
			console.log(itemParams);

			table.putItem(itemParams, function(err, data) {
				if(err)
				{
					if(!callbackErr)
						callbackErr = newUserResponseFailure;
					callbackErr(socket, err);
				}
				else
				{
					if(!callback)
						callback = newUserResponseSuccess;
					callback(socket, userKey);
				}
		    });
		});
	}
}
