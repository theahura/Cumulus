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

function storeDataToDb(socket, data)
{
	console.log(data);
	//dynamo stuff
	return true;
}

function loginResponse(socket, data)
{
	console.log(data.Item.userKey.S)
	socket.emit('serverToClient', {
		name: 'loginSuccess',
		userKey: data.Item.userKey.S
	});
}

function newUserResponse(socket, data)
{
	console.log(data)
	socket.emit('serverToClient', {
		name: 'newUserSuccess',
		userKey: data
	});
}

function serverError(socket, message)
{
	socket.emit('serverToClient',{
		name: 'Error',
		message: message
	});
}

function serverHandler(socket, incomingObj)
{
	if(incomingObj.name === 'store')
	{
		storeDataToDb(socket, incomingObj);
	}
	else if(incomingObj.name === 'login')
	{
		if(!incomingObj.username || typeof incomingObj.username !== 'string' || incomingObj.username.length === 0)
		{
			serverError(socket, "No or invalid username")
		}

		if(!incomingObj.password || typeof incomingObj.password !== 'string' || incomingObj.password.length === 0)
		{
			serverError(socket, "No or invalid password")
		}

		loginTools.checkOldUser(socket, userTable, incomingObj, loginResponse);
	}
	else if(incomingObj.name === 'newUser')
	{
		if(!incomingObj.username || typeof incomingObj.username !== 'string' || incomingObj.username.length === 0)
		{
			serverError(socket, "No or invalid username")
		}

		if(!incomingObj.password || typeof incomingObj.password !== 'string' || incomingObj.password.length === 0)
		{
			serverError(socket, "No or invalid password")
		}

		loginTools.regNewUser(socket, userTable, incomingObj, newUserResponse);
	}
	else
	{
		serverError(socket, 'No Name match');
	}
}

//On an io socket connection...
io.sockets.on('connection', function(socket) 
{
	console.log("CONNECTED")
	socket.on('clientToServer', function(data)
	{
		if(!(data && data.name))
			serverError(socket, 'Data did not have a name');

		serverHandler(socket, data);
	});

});