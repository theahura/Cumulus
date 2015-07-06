//AWS
//export AWS_ACCESS_KEY_ID
//export AWS_SECRET_ACCESS_KEY

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

var db = new AWS.DynamoDB();
var userTable = new AWS.DynamoDB({params: {TableName: 'Users'}});
var fileTable = new AWS.DynamoDB({params: {TableName: 'Files'}});

//Sockets
var io = require('socket.io').listen(3009);

function checkOldUser(socket, incomingObj)
{
	// Read the item from the table
  userTable.getItem({Key: {'userName':{'S':'theahura'}, 'passWord':{'S':'abcd'}}}, function(err, data) {
  	if(err)
  		console.log(err, err.stack)
  	else
    	console.log(data); // print the item data
  });
}

function generateUserKey(username, password)
{
	return username+password;
}

function regNewUser(socket, incomingObj)
{
	userKey = generateUserKey(incomingObj.username, incomingObj.password);
	var itemParams = {Item: {'userName': {'S': incomingObj.username}, 'passWord': {'S':incomingObj.password}, 'userKey': {'S': userKey}}};
	userTable.putItem(itemParams);
}

function storeDataToDb(socket, data)
{
	console.log(data);
	//dynamo stuff
	return true;
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
		checkOldUser(socket, incomingObj);
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

		regNewUser(socket, incomingObj);
	}
	else
	{
		serverError(socket, 'No Name match');
	}
}

