$("#DeleteButton").click(function()
{
	alert(document.id_store)
	deleteFile(document.id_store)
});

/**
 * Permanently delete a file, skipping the trash.
 *
 * @param {String} fileId ID of the file to delete.
 */
function deleteFile(fileId) {
  alert()
  var request = gapi.client.drive.files.delete({
    'fileId': fileId
  });
  request.execute(function(resp) { });
}