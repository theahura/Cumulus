/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

Runner file. Executes program, initializes available libraries, etc. 
*/

global_baseAPI = new baseAPI()
global_googleAPI = new GoogleAPI(baseAPI)

//Event triggers
$("#SubmitLogin").click(function() {   
	var username = $("#UsernameField").html()
	var password = $("#PasswordField").html();

	socket.emit("clientToServer", {
		name: "login",
		username: username,
		password: password
	});
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