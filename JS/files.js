/**
@author: Amol Kapoor
@date: 8-16-15
@version: 0.1

Manipulates file viewer
*/

/*
	Add file takes a file object and puts a file label in the list

	@Param: fileInfo; obj; object that contains info necessary to add a new event.
		fileInfo parameters include: 
			name
			chunks
*/
function addFile(fileInfo)
{
	var $FileObj = $("#FileTemplate").clone();

	$FileObj.attr("id", "file-" + globalFileCount);

	globalFileCount++;

	if(fileInfo.name)
		$FileObj.find(".file-name").html(fileInfo.name);

	if(fileInfo.size)
		$FileObj.find(".file-size").html(fileInfo.size);

	if(fileInfo.chunks)
		$FileObj.find(".file-chunk").html(fileInfo.chunks);

	$(".file-list-container").append($FileObj);
}

