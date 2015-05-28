//https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications

/**
 * Save function that actually does most of the heavy lifting with regards to saving to google drive
 * This is where the image compilation happens as well. 
 * 
 * Does some styling to let the user know that the app is saving, creates a canvas that can store the image necessary, 
 * loads the drive API and calls the appropriate request based on whether its a saveas or not
 * 
 * Must be called after scriptsCommon has loaded
 * 
 * @Param: IsSaveAs; Boolean; defines whether or not the file should be SAVED (i.e. new file) or UPDATED (i.e. change old file)
 * @Param: PageNumber; int; which page that needs to be saved (if null, assume the current page) 
 * @Param: Canvas; canvas; the image that needs to be saved (for student, assumes double image is built and already passed to save function)
 */
function Save(IsSaveAs, PageNumber, Canvas, PickLocation) 
{
    createMetaData(IsSaveAs, PageNumber, Canvas);
}

function createMetaData(IsSaveAs, PageNumber, Canvas)
{	
	 /*creates the current canvas image*/ 


	//loads api and calls proper function function
	 gapi.client.load('drive', 'v2', function () 
	 {		        
      var metadata = 
      {
          'title': PastName + "_" + PageNumber,
          'mimeType': 'image/png'		
      };
        
      newInsertFile(base64Data, metadata);
      
    });
}

/**
 * (From google api docs)
 * Insert new file to root folder in drive; SAVEAS
 *
 * @param {Image} Base 64 image data
 * @param {Metadata} Image metadata
 * @param {Function} callback Function to call when the request is complete.
 */
function newInsertFile(base64Data, metadata, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var contentType = metadata.mimeType || 'application/octet-stream';
    var multipartRequestBody = delimiter +
        'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' + base64Data + close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {
            'uploadType': 'multipart'
        },
            'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
            'body': multipartRequestBody
    });
    if (!callback) {
        callback = function (file) {
        };
    }
    request.execute(callback);
}

/**
 * (From google api docs)
 * Update an existing file's metadata and content.
 *
 * @param {String} fileId ID of the file to update.
 * @param {Object} fileMetadata existing Drive file's metadata.
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Callback function to call when the request is complete.
 */

function updateFile(fileId, base64Data, metadata, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var contentType = metadata.mimeType || 'application/octet-stream';
    var multipartRequestBody = delimiter +
        'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' + base64Data + close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files/' + fileId,
        'method': 'PUT',
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
            'body': multipartRequestBody
    });
    if (!callback) {
        callback = function (file) {
        	
        };
    }
    request.execute(callback);
}
