//starts not tree building stuff
var io = require('socket.io').listen(3005);

//connect to dynamo

//On an io socket connection...
io.sockets.on('connection', function(socket) 
{
	socket.on('clientToServer', function(data)
	{
		if(!(data && data.name))
			serverError(socket, "Data did not have a name");

		serverHandler(socket, data);
	});

});

function serverError(socket, message)
{
	socket.emit('serverToClient',{
		name: "Error",
		message: message
	});
}

function serverHandler(socket, incomingObj)
{
	if(incomingObj.name == "store")
	{
		storeDataToDb(socket, incomingObj);
	}
	else
	{
		serverError(socket, "No Name match");
	}
}

function storeDataToDb(socket, data)
{
	console.log(data);
	//dynamo stuff
	return true;
}