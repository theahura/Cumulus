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
function baseAPI(socket, userKey) {
	//Constructor
	var socket = socket;
	var userKey = userKey;

	var availableAPIs = {};

	function chunkFile(file, APIlist)
	{
		//get size and such in here for ordering, for now it just does one to one
		/*
			Get size of each api
			Order a list from largest to smallest
			Chunk file into sized chunks for each size as needed
			Store into an obj, return said obj
		*/
		returnObj = {};
		returnObj['gDrive'] = file;

		return returnObj;
	}

	this.storeDataToDB = function(file) {

		if(availableAPIs.length == 0) {
			alert("Not logged in to any services");
			return;
		}

		postObj = {
			"name": 'store',
			"userKey": userKey
		};

		//check for api size, determine which api to store to based on file, etc. etc. 
		var APIandFileChunk = chunkFile(file, availableAPIs);
		console.log(APIandFileChunk);

		deferredArray = [];

		for(apiName in APIandFileChunk) {
			deferred = new $.Deferred();
			availableAPIs[apiName].storeDataToDB(APIandFileChunk[apiName], function(fileInfo){
				postObj[apiName] = fileInfo;
				deferred.resolve();
			});
			deferredArray.push(deferred);
		}

		//store information about file to dynamo through a server
		$.when.apply($, deferredArray).then(function() { 
			alert();
			socket.emit("clientToServer", postObj);
		});
	}

	this.retrieveDataFromDB = function(fileNameAndPath) {
		//grab dynamo info from server, send it to the appropriate apis
	}

	this.deleteDataFromDB = function(fileNameAndPath) {
		//grab dynamo info from server, send it to the appropriate apis
	}

	this.loginToAPI = function(api) {
		availableAPIs[api.APIname] = api;
		console.log(availableAPIs);
		alert("API ADDED");
	}

	this.logoutFromAPI = function(api) {
		delete availableAPIs[api.APIname]
	}

}


