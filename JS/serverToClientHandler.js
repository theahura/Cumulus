/**
@author: Amol Kapoor
@date: 7-7-15
@version: 0.1

Handles incoming/outgoing server connections
*/

socket.on('serverToClient', function(data) {
	if(data.name === 'Error') {
		errorHandler(data);
	}
	else {
		alert("no name found");
	}
});