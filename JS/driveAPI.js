/*
@author: Amol Kapoor
@date: 6-29-15

This class defines the functions for Google Drive API
*/ 

/*
Google Drive API class
@param: library; mongodb collection to store file info
*/
function GoogleAPI(parent) {
    //Constructor
    this.APIname = "gDrive";

    var parent = parent;
    var selfVar = this;

    var CLIENT_ID = '871670712835-a5a2j5uaein2copvj19vqia8girjk8jl.apps.googleusercontent.com';
    var SCOPES = 'https://www.googleapis.com/auth/drive';

    this.storeDataToDB = function(fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
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
            request.execute(function (file) {
                callback(file.id);
            });
        }
    }

    this.retrieveDataFromDB = function(fileId, callback) {
        var fileURL = 'https://www.googleapis.com/drive/v2/files/' + fileId + '?alt=media';
        var accessToken = gapi.auth.getToken().access_token;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', fileURL);
        xhr.responseType='blob'
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);

        xhr.onload = function() {
            var blob = new Blob([this.response]);

            callback(blob);
        };
        xhr.onerror = function() {
            callback(null);
        };
        xhr.send();
    }

    this.deleteDataFromDB = function(fileId, callback) {
        var request = gapi.client.drive.files.delete({
            'fileId': fileId
        });

        request.execute(function(resp) {
            callback();
        });
    }

    this.loginToAPI = function() {
        //  document.getElementById("LoadingColor").style.display = "block";
        gapi.client.load('drive', 'v2', checkAuth);

        function checkAuth() {
            gapi.auth.authorize(
               {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
               login);
        }

        function login(authResult) {        
           if (authResult && !authResult.error) {
               var request = gapi.client.drive.about.get(); //gets username
               request.execute(function(resp) {
                    alert("Logged in to Google Drive as: " + resp.name);
                    
                    parent.loginToAPI(selfVar);

                    return true;
               });
           }
           else if (authResult && authResult.error) {
               if (authResult.error === "immediate_failed" || authResult.error === "access_denied") {
                    alert("Not logged in to Google Drive");
               }
               else {
                   alert("There was an error: " + authResult.error)
               }
               return false; 
           }
           else {
               alert("Not logged in to Google Drive");
               return false;
           }
        }
    }

    this.logoutFromAPI = function() {
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
                alert("Logged Out of Google Drive");
            },
            
            error: function(e) {
                alert("There was an error: " + e);
            }
        });
    }
}


