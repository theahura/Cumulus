/*
@author: Amol Kapoor
@date: 6-29-15

This class defines the functions that must be available by each version of an API hack to ensure consistency and stability 
of both variable names and overall structure. 
*/ 

/* extending */
function extend(ChildClass, ParentClass) {
	ChildClass.prototype = new ParentClass();
	ChildClass.prototype.constructor = ChildClass;
}

/*
Base API class. 

@param: library; mongodb collection to store file info
*/
var baseAPI = function(library)
{
	//Constructor
	var library = library

	//Public functions (need to be overridden)
	this.storeDataToDB = function()
	{
		throw "This function needs to be overridden"
	}

	this.retrieveDataFromDB = function()
	{
		throw "This function needs to be overridden"
	}

	this.deleteDataFromDB = function()
	{
		throw "This function needs to be overridden"
	}

	this.loginToAPI = function()
	{
		throw "This function needs to be overridden"
	}

	this.logoutFromAPI = function()
	{
		throw "This function needs to be overridden"
	}

}


