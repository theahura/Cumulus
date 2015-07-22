/**
@author: Amol Kapoor
@date: 7-20-15
@version: 0.1

File storage module
*/

//AWS dependency - not sure if needed? 
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

/**
	Emit file check failure
	
	@param: socket; socket.io connetion; user to send error message to 
	@param: data;
		@param: message; string; message to send
	@param: extrakey; string; key to tell if app error or not
*/
function checkFileFailure(socket, data, extraKey) {
	console.log(data)
	socket.emit('serverToClient', {
		name: 'checkFileFailure',
		error: data.message,
		extraKey: extraKey
	});
}

//Exposed functions
module.exports = {

	/**
		Checks a filename to make sure it is not already in the db, avoiding risk of unintentional overwrite

		@param: socket; socket.io connection; user to connect to
		@param: table; dynamo.db table; where to search for filename
		@param: incomingObj
			@param: pathAndFileName; string; the string of representing the path of the file
			@param: userKey; string; the identifier for the user
		@param: callback; function; function to call if file exists or not, with bool passed accordingly
	*/
	checkFile: function(socket, table, incomingObj, callback) {
		table.getItem({Key: {'pathAndFileName':{'S':incomingObj['pathAndFileName']}, 'userKey':{'S':incomingObj['userKey']}}}, function(err, data)  {
			if(err) {
				checkFileFailure(socket, err);
			}
			else if(data.Item) {
				callback(true);
			}
			else {
				callback(false)
			}
		});
	},

	/**
		Actually stores the relevant file retrieval data to dynamo

		@param: socket; socket.io connection; user to connect to 
		@param: table; dynamo.db table; where to store info
		@param: incomingObj
			@param: pathAndFileName; string; the string representing the path of the file
			@param: userKey; string; the indentifier for the user
	*/
	storeDataToDb: function(socket, table, incomingObj) {

		dataObj = {};
		dataObj['userKey'] = {'S' : incomingObj['userKey']};
		dataObj['pathAndFileName'] = {'S' : incomingObj['pathAndFileName']};
		dataObj['APIlist'] = {'M':{}}

		for(key in incomingObj) {
			if(key === 'name' || key === 'userKey' || key === 'pathAndFileName')
				continue;

			dataObj['APIlist']['M'][key] = {'S':incomingObj[key]};
		}

		var itemParams = {Item: dataObj};
		
		console.log(itemParams);
		
		table.putItem(itemParams, function(err, data) {
			if(err) {
				console.log(err);
			}
			else {
				console.log(data);
			}
		});

	},

	retrieveFile: function(socket, table, incomingObj, callback) {
		table.getItem({Key: {'pathAndFileName':{'S':incomingObj['pathAndFileName']}, 'userKey':{'S':incomingObj['userKey']}}}, function(err, data)  {
			if(err) {
				checkFileFailure(socket, err);
			}
			else if(data.Item.APIlist.M) {
				dynamoAPIlist = data.Item.APIlist.M;
				APIlist = {};

				for(name in dynamoAPIlist) {
					APIlist[name] = dynamoAPIlist[name]['S'];
				}

				callback(APIlist);
			}
			else {
				callback(null);
			}
		});
	},

	deleteFile: function(socket, table, incomingObj, callback) {
		console.log(incomingObj['pathAndFileName'])
		console.log(incomingObj['userKey'])
		console.log(incomingObj)

		table.deleteItem({Key: {'pathAndFileName':{'S':incomingObj['pathAndFileName']}, 'userKey':{'S':incomingObj['userKey']}}}, function(err)  {
			if(err) {
				checkFileFailure(socket, err);
			}
			else {
				callback();
			}
		});
	}
}
