/**
@author: Amol Kapoor
@date: 6-30-15
@version: 0.1

Runner file. Executes program, initializes available libraries, etc. 
*/

//Connection to Backend
socket = io('http://54.86.173.127:3004');


//Event triggers
$("#DeleteButton").click(function()
{

});


$("#LoginButton").click(function()
{   
    //APIS
    baseAPI = new baseAPI(socket)
    googleDrive = new GoogleAPI(baseAPI)
    alert("Already logged in as " + User); 
});

$("#LogoutButton").click(function()
{   
    alert("Not logged in");
});

$("#DriveLoginButton").click(function()
{   

    alert("Already logged in as " + User); 
});

$("#DriveLogoutButton").click(function()
{   
    alert("Not logged in");
});

$("#RetrieveButton").click(function()
{

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
      insertFile(f)
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('SaveButton').addEventListener('change', handleFileSelect, false);