
$("#LoginButton").click(function showInputLogin() {
    document.getElementById("NewUserButton").style.display = "none";
    document.getElementById("LoginButton").style.display = "none";
    document.getElementById("SubmitLogin").style.display = "inline";
    document.getElementById("UsernameField").style.display = "inline";
    document.getElementById("PasswordField").style.display = "inline";
    document.getElementById("Cancel").style.display = "inline";
});


$("#Cancel").click(function hideInputLogin() {
    document.getElementById("NewUserButton").style.display = "inline";
    document.getElementById("LoginButton").style.display = "inline";
    document.getElementById("SubmitLogin").style.display = "none";
    document.getElementById("UsernameField").style.display = "none";
    document.getElementById("PasswordField").style.display = "none";

    document.getElementById("Cancel").style.display = "none";
});

$('#NewUserButton, #CancelUserCreator').click(function toggleUserCreator() {
    $('#FlavorText, #UserCreator').slideToggle('fast');
});

$('#terms').click(function() { alert("We own you")});

$('#privacy').click(function() { alert("We have none, sucker")});

$('#GetStartedButton').click(function() {
    this.parentNodes.submit();    
});

$('#logo').click(function() {
    location.reload();
});


//-----------------------------
$("#AddCloud").click(function(){
    $(".new-cloud-panel").fadeIn();
});

$(".new-cloud-cover").click(function(){
    $(".new-cloud-panel").fadeOut();
});

