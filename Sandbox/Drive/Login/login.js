
//Key info
var CLIENT_ID = '871670712835-a5a2j5uaein2copvj19vqia8girjk8jl.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

//Type: String; the name of the current user logged into gDrive
var User;

//Type: Token; the string used by google to authorize calls to a user's drive
var OauthToken = null;

//Type: Bool; tracks whether someone is logged in currently
var Auth = false;



$("#LoginButton").click(function()
{	
	if(!Auth)
	{
		//requests login info, and calls the login function handler on callback
		gapi.auth.authorize(
	           {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
	           login);
	}
	else
		alert("Already logged in as " + User);
	
});


$("#LogoutButton").click(function()
{	
	if(Auth)
		logout();
	else
		alert("Not logged in");
});



window.onload = function () 
{
  //  document.getElementById("LoadingColor").style.display = "block";
    gapi.client.load('drive', 'v2', handleClientLoad);
}

/**
 * Called when the client library is loaded to start the authorization flow.
 */
function handleClientLoad() {
  window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
 gapi.auth.authorize(
	           {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
	           login);
}

/**
 * Called when authorization server replies. Sets login vars, manipulates loading vars
 *
 * @param {Object} authResult Authorization result.
 */
function login(authResult) 
{    	 
   if (authResult && !authResult.error) {
	   var request = gapi.client.drive.about.get(); //gets username
	   request.execute(function(resp) 
	   {
		   	  User = resp.name;

		   	  alert("Logged in to Google Drive as: " + User);
	    	 // alert("Logged in to Google Drive as: " + User);
	    	  	    		  
	    	  Auth = true;	 
	    	  OauthToken = authResult.access_token;
	    	  
	    	  return true;
	   });
   }
   else if (authResult && authResult.error)
   {
	   if (authResult.error === "immediate_failed" || authResult.error === "access_denied")
	   {
			alert("Not logged in to Google Drive");
	   }
	   else
	   {
		   alert("There was an error: " + authResult.error)
   	   }
	   return false; 
   }
   else
   {
	   alert("Not logged in to Google Drive");
	   return false;
   }
}

/**
 * Logout scripts. Sets authorization vars to false, clears googledrive save ids, and revokes the URL token. 
 * Alerts user when finished. 
 * 
 */
function logout()
{	
	
	//sets up the url to revoke the login token
	var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + gapi.auth.getToken().access_token;

	  // Perform an asynchronous GET request to revoke the google account login token
	  $.ajax({
	    type: 'GET',
	    url: revokeUrl,
	    async: false,
	    contentType: "application/json",
	    dataType: 'jsonp',
	    success: function(nullResponse) {
	    	//clears user tracker and modified UI accordingly 
	    	  User = null;
	    	  OauthToken = null;
	    	  //sets login tracker to logout
	    	  Auth = false;
	    	  
	    	 alert("Logged Out of Google Drive");
	    },
	    error: function(e) {
	    	alert("There was an error: " + e);
	    }
	 });
}