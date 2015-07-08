/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

User registration and login module 
*/
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

function generateUserKey(username, password)
{
	return username+password;
} 

module.exports = 
{
	checkOldUser: function(socket, table, incomingObj, callback)
	{
		// Read the item from the table
	  table.getItem({Key: {'userName':{'S':incomingObj.username}, 'passWord':{'S':incomingObj.password}}}, function(err, data) {
	  	if(err)
	  		console.log(err, err.stack)
	  	else
	    	callback(socket, data); // print the item data
	  });
	}, 

	regNewUser: function(socket, table, incomingObj, callback)
	{
		console.log('new user')
		userKey = generateUserKey(incomingObj.username, incomingObj.password);
		var itemParams = {Item: {'userName': {'S': incomingObj.username}, 'passWord': {'S':incomingObj.password}, 'userKey': {'S': userKey}}};
		
		table.putItem(itemParams, function(err, data) {
			if(err)
				console.log(err)
			else
				callback(socket, userKey)
	    });
	}
}
