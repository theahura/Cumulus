
$("#UsernameField, #PasswordField").click(function clearBox(itemID) {
    document.getElementById(itemID).innerHTML = "";
});

$("#LoginButton").click(function showInputLogin() {
	alert()
    document.getElementById("NewUserButton").style.display = "none";
    document.getElementById("LoginButton").style.display = "none";
    document.getElementById("UsernameField").style.display = "inline";
    document.getElementById("PasswordField").style.display = "inline";
    $("#SubmitLogin").fadeIn()
    document.getElementById("Cancel").style.display = "inline";
});


$("#Cancel").click(function hideInputLogin() {
    document.getElementById("NewUserButton").style.display = "inline";
    document.getElementById("LoginButton").style.display = "inline";
    document.getElementById("UsernameField").style.display = "none";
    document.getElementById("PasswordField").style.display = "none";
    $("#SubmitLogin").fadeOut()
    document.getElementById("Cancel").style.display = "none";
});