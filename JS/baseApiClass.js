/*
@author: Amol Kapoor
@date: 6-29-15

This class defines the functions that must be available by each version of an API hack to ensure consistency and stability 
of both variable names and overall structure. 

Deals with dynamodb storage. 

Will essentially store whatever information is necessary per API request to an attribute with that APIs name, and then pull back and send it to 
respective functions as necessary. An object in dynamo may therefore look like:

{
	fileName: unique file name identifier with path

	userKey: unique key associated with a user login, required for searching by backend

	Drive: fileId

	Dropbox: fileId

	flickr: Encryption mech + fileId

	etc.
}

Base API will have instantiations of all of the other APIs and will be called as a handler to activate different functions in the lower apis

*/ 


/*
Base API class. 

@param: library; dynamodb collection to store file info
*/
function baseAPI(socket, userKey)
{
	//Constructor
	var socket = socket
	var userKey = userKey

	var availableAPIs = []

	this.storeDataToDB = function(file)
	{
		postObj = {
			"userKey": userKey
		}

		//check for api size, determine which api to store to based on file, etc. etc. 

		for(api in availableAPIs)
		{
			postObj[api.APIname] = api.storeDataToDB(file)
		}

		//store information about file to dynamo through a server
		socket.emit("clientToServer", postObj);
	}

	this.retrieveDataFromDB = function(fileNameAndPath)
	{
		//store information about file to dynamo through a server
	}

	this.deleteDataFromDB = function(fileNameAndPath)
	{
		//store information about file to dynamo through a server
	}

	this.loginToAPI = function(api)
	{
		availableAPIs.push(api)
	}

	this.logoutFromAPI = function(this)
	{
		var index = availableAPIs.indexOf(api)
		availableAPIs.splice(index, 1)
	}

}


