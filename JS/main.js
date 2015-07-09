/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

Runner file. Executes program, initializes available libraries, etc. 
*/

//Event triggers
$("#LoginButton").click(function()
{   
	username = prompt("User Name?");
	password = prompt("Password?");

	socket.emit("clientToServer", {
		name: "login",
		username: username,
		password: password
	});
});

$("#LogoutButton").click(function()
{   
	alert("Not logged in");
});

$("#NewUserButton").click(function()
{
	username = prompt("User Name?");
	password = prompt("Password?");
	email = prompt("Email?");
	fullname = prompt("Name?");

	socket.emit("clientToServer", {
		name: "newUser",
		username: username,
		password: password,
		email: email, 
		fullname: fullname
	});
});
