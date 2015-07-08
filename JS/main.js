/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

Runner file. Executes program, initializes available libraries, etc. 
*/

//Event triggers
$("#LoginButton").click(function()
{   
	userName = prompt("User Name?");
	password = prompt("Password?");

	socket.emit("clientToServer", {
		name: "login",
		username: userName,
		password: password
	});
});

$("#LogoutButton").click(function()
{   
	alert("Not logged in");
});

$("#NewUserButton").click(function()
{
	userName = prompt("User Name?");
	password = prompt("Password?");

	socket.emit("clientToServer", {
		name: "newUser",
		username: userName,
		password: password
	});
});
