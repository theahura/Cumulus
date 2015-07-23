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
	alert('bitch2');
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
		}, function(data, err, isAppError) {
			if(err) {
				errorHandler(err, isAppError);
			} 
			else {
				login(data);
			}
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
	}, function(data, err, appError) {
		if(err) {
			errorHandler(err, appError);
		}		
		else {
			login(data);
		}
	});
});

$(".Google").click(function(){
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

$("#HiddenSubmitLogin").submit(function() {
	alert('bitch');
	$("#SubmitLogin").trigger("click");
})

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

document.getElementById('HiddenUploadButton').addEventListener('change', handleFileSelect, false);

$("#UploadButton").click(function() {
	$("#HiddenUploadButton").click();
});
