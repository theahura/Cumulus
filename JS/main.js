/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

Runner file. Executes program, initializes available libraries, etc. 
*/

//Connection to Backend
socket = io('http://54.86.173.127:3009');


//Event triggers
$("#LoginButton").click(function()
{   
	alert("Already logged in"); 
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
		userName: userName,
		password: password
	});
});
