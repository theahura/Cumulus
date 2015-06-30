/*
@author: Amol Kapoor
@date: 6-29-15

This class defines the functions for Google Drive API
*/ 

/*
Google Drive API class
@param: library; mongodb collection to store file info
*/
function GoogleAPI(library, apiName)
{
    //Constructor
    this.apiName = apiName
    var parent = new baseApiClass(library)

    //Public functions (need to be overridden)
    this.storeDataToDB = function(fileData)
    {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) 
        {
            var contentType = fileData.type || 'application/octet-stream';
            var metadata = {
                'title': fileData.name,
                'mimeType': contentType
            };

            var base64Data = btoa(reader.result);
            var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

            var request = gapi.client.request({
                'path': '/upload/drive/v2/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                  'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody});

            //GET THE FILE ID AND STORE TO DYNAMO THROUGH THE PARENT
            request.execute(function()
            {
                parent.storeDataToDB(apiName, fileId)
            });
        }
    }

    this.retrieveDataFromDB = function(fileId)
    {
        var request = gapi.client.drive.files.get({
            'fileId': fileId
        });

        request.execute(function(resp) 
        {
            console.log('Title: ' + resp.title);
            console.log('Description: ' + resp.description);
            console.log('MIME type: ' + resp.mimeType);
            document.location = result[i].webContentLink
        });
    }

    this.deleteDataFromDB = function(fileNameAndPath, userKey)
    {
        var request = gapi.client.drive.files.delete({
            'fileId': fileId
        });

        request.execute(function(resp) { });
    }

    this.loginToAPI = function()
    {
        //  document.getElementById("LoadingColor").style.display = "block";
        gapi.client.load('drive', 'v2', checkAuth);

        function checkAuth() 
        {
            gapi.auth.authorize(
               {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
               login);
        }

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
                      
                    parent.loginToAPI(apiName)

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
    }

    this.logoutFromAPI = function()
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
            success: function(nullResponse) 
            {
                //clears user tracker and modified UI accordingly 
                User = null;
                OauthToken = null;
                //sets login tracker to logout
                Auth = false;
              
                alert("Logged Out of Google Drive");

                parent.logoutFromAPI(apiName)
            },
            
            error: function(e) 
            {
                alert("There was an error: " + e);
            }
        });
    }

}


