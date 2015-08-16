/**
@author: Amol Kapoor
@date: 7-20-15
@version: 0.1

File storage module
*/

//AWS dependency - not sure if needed? 
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';


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
				callback(null, err);
			}
			else if(data.Item) {
				callback(true);
			}
			else {
				callback(false)
			}
		});
	},

	getUserFiles: function(table, userKey, callback) {
		table.query({
			ExpressionAttributeValues: {
				":hashval": userKey,
			},
			KeyConditionExpression: "userKey = :hashval"
		}, function(err, data)  {

			if(err) {
				callback(null, err);
			}
			else if(data.Items && data.Items.length > 0) {		
				callback(data.Items);
			}
			else {
				callback(null);
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
		console.log(incomingObj)
		dataObj = {};
		dataObj['userKey'] = {'S' : incomingObj['userKey']};
		dataObj['pathAndFileName'] = {'S' : incomingObj['pathAndFileName']};
		dataObj['size'] = {'N' : incomingObj['size'] + ""};
		dataObj['APIlist'] = {'M':{}}

		for(key in incomingObj) {
			if(key === 'name' || key === 'userKey' || key === 'pathAndFileName' || key === 'size')
				continue;

			dataObj['APIlist']['M'][key] = {'S':incomingObj[key]};
		}

		var itemParams = {Item: dataObj};
				
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
				callback(null, err);
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

		table.deleteItem({Key: {'pathAndFileName':{'S':incomingObj['pathAndFileName']}, 'userKey':{'S':incomingObj['userKey']}}}, function(err)  {
			if(err) {
				callback(null, err);
			}
			else {
				callback();
			}
		});
	}
}
