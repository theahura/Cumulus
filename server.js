//AWS
//export AWS_ACCESS_KEY_ID
//export AWS_SECRET_ACCESS_KEY

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

var db = new AWS.DynamoDB();
var userTable = new AWS.DynamoDB({params: {TableName: 'Users'}});
var fileTable = new AWS.DynamoDB({params: {TableName: 'Files'}});


db.listTables(function(err, data) 
{
	if(err)
		console.log(err, err.stack);
	else
  		console.log(data);
});

var itemParams = {Item: {'userName': {'S':'theahura'}, 'passWord': {'S':'abcd'}, 'userKey': {'S':'somehash'}}};
userTable.putItem(itemParams, function() {
  // Read the item from the table
  userTable.getItem({Key: {'userName':{'S':'theahura'}, 'passWord':{'S':'abcd'}}}, function(err, data) {
  	if(err)
  		console.log(err, err.stack)
  	else
    	console.log(data); // print the item data
  });
});

//Sockets
var io = require('socket.io').listen(3005);

//On an io socket connection...
io.sockets.on('connection', function(socket) 
{
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

	}
	else if(incomingObj.name === 'newUser')
	{

	}
	else
	{
		serverError(socket, 'No Name match');
	}
}

function storeDataToDb(socket, data)
{
	console.log(data);
	//dynamo stuff
	return true;
}