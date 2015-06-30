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

@param: library; mongodb collection to store file info
*/
function baseAPI(library)
{
	//Constructor
	var library = library

	//Public functions (need to be overridden)
	this.storeDataToDB = function()
	{
		//store information about file to dynamo through a server
	}

	this.retrieveDataFromDB = function(fileNameAndPath, userKey)
	{
		//store information about file to dynamo through a server
	}

	this.deleteDataFromDB = function(fileNameAndPath, userKey)
	{
		//store information about file to dynamo through a server
	}

	this.loginToAPI = function(apiName)
	{
		//store tracking info about api
	}

	this.logoutFromAPI = function(apiName)
	{
		//remove tracking info about api
	}

}


