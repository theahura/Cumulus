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
function baseAPI(socket) {
	//Constructor
	var socket = socket;
	var availableAPIs = {};

	var userKey = null;

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

	/**
		Stores a file to the cloud

		Input file

		Check if file exists in cloud
			if yes, return
			if no, 
				chunk file based on available api sizes
				get file info necessary to retrieve file from api 
				store that file info into dynamo
	*/
	this.storeDataToDB = function(file) {
		if(!userKey) {
			alert("Log in first!")
			return;
		}

		console.log(file)

		postObj = {
			"name": 'checkFile',
			"userKey": userKey,
			"pathAndFileName": file.name
		};

		//Check if file already exists
		socket.emit("clientToServer", postObj, function(inDB) {
			
			if(inDB) {
				alert("File name taken");
				return;
			}

			//if the file does not already exist...
			postObj['name'] = 'store';

			//check for api size, determine which api to store to based on file, etc. etc. 
			var APIandFileChunk = chunkFile(file, availableAPIs);
			console.log(APIandFileChunk);

			deferredArray = [];

			var count = 0;

			for(apiName in APIandFileChunk) {
				deferred = new $.Deferred();
				availableAPIs[apiName].storeDataToDB(APIandFileChunk[apiName], function(fileInfo){
					postObj[count + "_" + apiName] = fileInfo;
					count++;
					deferred.resolve();
				});
				deferredArray.push(deferred);
			}

			//store information about file to dynamo through a server
			$.when.apply($, deferredArray).then(function() { 
				socket.emit("clientToServer", postObj);
			});
		});
	}

	/**
		Input a file name/path
		Check dynamo if the file exists
			if not, return
			if yes, 
				for each api in the returned APIList object, call retrieve
				piece together file
				return file
	*/
	this.retrieveDataFromDB = function(pathAndFileName) {
		if(!userKey) {
			alert("Log in first!")
			return;
		}

		socket.emit("clientToServer", {
			name:"retrieve", 
			pathAndFileName: pathAndFileName, 
			userKey: userKey
		}, function(data) {

			fileArray = [];

			deferredArray = [];

			for(apiNameAndNum in data) {
				deferred = new $.Deferred();

				apiInfo = apiNameAndNum.split('_');

				apiIndex = apiInfo[0];
				apiName = apiInfo[1];
				fileData = data[apiNameAndNum];

				if(!availableAPIs[apiName]) {
					alert("Log in to " + apiName + " first!");
					return;
				}

				availableAPIs[apiName].retrieveDataFromDB(fileData, function(filePart){
					fileArray[apiIndex] = filePart;
					deferred.resolve();
				});

				deferredArray.push(deferred);
			}

			//store information about file to dynamo through a server
			$.when.apply($, deferredArray).then(function() {

				var fileBlob = new Blob(fileArray);

				console.log(fileBlob);

				var url = window.URL.createObjectURL(fileBlob);

				$("#downloadLink").attr("href", url).attr("download", pathAndFileName);
			});

		});
	}

	this.deleteDataFromDB = function(pathAndFileName) {
		if(!userKey) {
			alert("Log in first!")
			return;
		}

		socket.emit("clientToServer", {
			name:"retrieve", 
			pathAndFileName: pathAndFileName, 
			userKey: userKey
		}, function(data) {

			console.log(data);

			deferredArray = [];

			for(apiNameAndNum in data) {
				deferred = new $.Deferred();

				apiInfo = apiNameAndNum.split('_');

				apiIndex = apiInfo[0];
				apiName = apiInfo[1];
				fileData = data[apiNameAndNum];

				if(!availableAPIs[apiName]) {
					alert("Log in to " + apiName + " first!");
					return;
				}
				
				console.log("HELLO");
				console.log(fileData);

				availableAPIs[apiName].deleteDataFromDB(fileData, function(){
					console.log('HELLO')
					deferred.resolve();
				});

				deferredArray.push(deferred);
			}

			//store information about file to dynamo through a server
			$.when.apply($, deferredArray).then(function() {

				socket.emit("clientToServer", {
					name:"delete", 
					pathAndFileName: pathAndFileName, 
					userKey: userKey
				}, function() {
					alert("File deleted");
				});

			});

		});
		//grab dynamo info from server, send it to the appropriate apis
	}

	this.loginToAPI = function(api) {
		if(!userKey) {
			alert("Log in first!")
			return;
		}

		availableAPIs[api.APIname] = api;
		console.log(availableAPIs);
		alert("API ADDED");
	}

	this.logoutFromAPI = function(api) {
		if(!userKey) {
			alert("Log in first!")
			return;
		}

		delete availableAPIs[api.APIname]
	}

	this.setUserKey = function(inputUserKey) {
		userKey = inputUserKey;
	}

}


