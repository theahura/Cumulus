/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

Runner file. Executes program, initializes available libraries, etc. 
*/

global_baseAPI = new baseAPI(socket);
global_googleAPI = new GoogleAPI(global_baseAPI);

//Event triggers

$("#SubmitLogin").click(function () {
    $("#TitlebarForm").submit(function(event) {
		event.preventDefault();

	    var $inputs = $('#TitlebarForm :input');
		var values = {};
	    $inputs.each(function() {
	        values[this.name] = $(this).val();
	    });
	    console.log(values);
		socket.emit("clientToServer", {
	        name: "login",
	        username: values.username,
			password: values.password
		});
	});

	$("#TitlebarForm").submit();
});

$("#LogoutButton").click(function() {   
	alert("Not logged in");
});

$("#RegisterNewUser").submit(function(event) {
	event.preventDefault();

    var $inputs = $('#RegisterNewUser :input');
	var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });

	socket.emit("clientToServer", {
		name: "newUser",
		username: values.username,
		password: values.password,
		email: values.email, 
		fullname: values.firstname + " " + values.lastname
	});
});

$("#DriveLoginButton").click(function(){
	global_googleAPI.loginToAPI();
});


$("#RetrieveButton").click(function(){
	fileNameAndPath = prompt("Filename?");
	global_baseAPI.retrieveDataFromDB(fileNameAndPath);
});

$("#DeleteButton").click(function() {
	fileNameAndPath = prompt("Filename?");
	global_baseAPI.deleteDataFromDB(fileNameAndPath);
});

$("#SubmitLogin").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("form").submit();
    }
});

//Copy pasted from interwobs. Could probably be better.
function handleFileSelect(evt)
{
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) 
    {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');

    	//Calls the save function for gdrive
    	global_baseAPI.storeDataToDB(f);
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('SaveButton').addEventListener('change', handleFileSelect, false);

