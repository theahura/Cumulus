//AWS
//export AWS_ACCESS_KEY_ID
//export AWS_SECRET_ACCESS_KEY


var AWS = require('aws-sdk');
var loginTools = require('./loginTools');
var storageTools = require('./storageTools');

//AWS config
AWS.config.region = 'us-east-1';
var userTable = new AWS.DynamoDB({params: {TableName: 'CumulusUsers'}});
var fileTable = new AWS.DynamoDB({params: {TableName: 'CumulusFiles'}});

//Sockets
var io = require('socket.io').listen(5000);

/**
	Checks an input string to make sure it is sanitized for database input

	@param: inputString; string; the string to be checked

	@return: true if alphanumeric string of some length, false otherwise
*/
function isSanitized(inputString) {
	if(!inputString || typeof inputString !== 'string' || inputString.length === 0 || !/^[a-z0-9]+$/i.test(inputString))
		return false;
	return true;
}

/**
	Generic error reply function. Sends a message to a socket with error as message header

	@param: socket; socket.io connection; connection to user who needs to see error
	@param: message; string; the message to send to the user
*/
function serverError(socket, message) {
	socket.emit('serverToClient',{
		name: 'Error',
		message: message
	});
}

/**
	Generally handles all client requests from a socket. Takes incoming requests, parses by name, and runs necessary checks
	on function inputs before sending data to the requested function. 

	@param: socket; socket.io connection; the connection to the client sending data
	@param: incomingObj; obj; data sent from client
*/
function serverHandler(socket, incomingObj, callback) {
	if(incomingObj.name === 'store') {	
		storageTools.storeDataToDb(socket, fileTable, incomingObj);
	}
	else if(incomingObj.name === 'checkFile') {
		storageTools.checkFile(socket, fileTable, incomingObj, callback);
	}
	else if(incomingObj.name === "retrieve") {
		storageTools.retrieveFile(socket, fileTable, incomingObj, callback);
	}
	else if(incomingObj.name === "delete") {
		storageTools.deleteFile(socket, fileTable, incomingObj, callback);
	}
	else if(incomingObj.name === 'login') {
		loginTools.loginUser(socket, userTable, incomingObj, function(data, err, key) {

			if(err) {
				callback(data, err, key);
			}
			
			storageTools.getUserFiles(fileTable, data.userKey, function(userFiles) {

				data['userFiles'] = userFiles;

				callback(data, err, key);
			});
		});
	}
	else if(incomingObj.name === 'newUser') {
		loginTools.regNewUser(socket, userTable, incomingObj, callback);
	}
	else {
		serverError(socket, 'No Name match');
	}
}

//On an io socket connection...
//Main
io.sockets.on('connection', function(socket) {
	console.log("CONNECTED")

	socket.on('disconnect', function() {
     	console.log('Got disconnect!');
   	});
   	
	socket.on('clientToServer', function(data, callback) {
		if(!(data && data.name))
			serverError(socket, 'Data did not have a name');

		serverHandler(socket, data, callback);
	});

});