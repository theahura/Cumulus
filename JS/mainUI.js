document.getElementById("usernamefield").style.display = "none";
document.getElementById("passwordfield").style.display = "none";
document.getElementById("cancel").style.display = "none";

function clearBox(itemID) {
    document.getElementById(itemID).innerHTML = "";
}

function showInputLogin() {
    document.getElementById("NewUserButton").style.display = "none";
    document.getElementById("usernamefield").style.display = "inline";
    document.getElementById("passwordfield").style.display = "inline";
    document.getElementById("cancel").style.display = "inline";
}

function hideInputLogin() {
    document.getElementById("NewUserButton").style.display = "inline";
    document.getElementById("usernamefield").style.display = "none";
    document.getElementById("passwordfield").style.display = "none";
    document.getElementById("cancel").style.display = "none";