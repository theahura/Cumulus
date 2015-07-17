//AWS
//export AWS_ACCESS_KEY_ID
//export AWS_SECRET_ACCESS_KEY


var AWS = require('aws-sdk');
var loginTools = require('./loginTools')

//AWS config
AWS.config.region = 'us-east-1';
var userTable = new AWS.DynamoDB({params: {TableName: 'Users'}});
var fileTable = new AWS.DynamoDB({params: {TableName: 'Files'}});

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

function storeDataToDb(socket, table, incomingObj, callback) {

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
}

/**
	Generally handles all client requests from a socket. Takes incoming requests, parses by name, and runs necessary checks
	on function inputs before sending data to the requested function. 

	@param: socket; socket.io connection; the connection to the client sending data
	@param: incomingObj; obj; data sent from client
*/
function serverHandler(socket, incomingObj) {
	if(incomingObj.name === 'store') {
		storeDataToDb(socket, fileTable, incomingObj);
	}
	else if(incomingObj.name === 'login') {
		if(!isSanitized(incomingObj.username)) {
			serverError(socket, "No or invalid username");
			return;
		}

		if(!isSanitized(incomingObj.password)) {
			serverError(socket, "No or invalid password");
			return;
		}

		loginTools.loginUser(socket, userTable, incomingObj);
	}
	else if(incomingObj.name === 'newUser') {
		if(!isSanitized(incomingObj.username)) {
			serverError(socket, "No or invalid username");
			return;
		}

		if(!isSanitized(incomingObj.password)) {
			serverError(socket, "No or invalid password");
			return;
		}

		var testEmail = incomingObj.email.replace('@', '').replace('.', '');
		if(!isSanitized(testEmail)) {
			serverError(socket, "No or invalid email");
			return;
		}

		if(!isSanitized(incomingObj.fullname)) {
			serverError(socket, "No or invalid fullname");
			return;
		}

		loginTools.regNewUser(socket, userTable, incomingObj);
	}
	else {
		serverError(socket, 'No Name match');
	}
}

//On an io socket connection...
//Main
io.sockets.on('connection', function(socket) {
	console.log("CONNECTED")
	socket.on('clientToServer', function(data) {
		if(!(data && data.name))
			serverError(socket, 'Data did not have a name');

		serverHandler(socket, data);
	});

});