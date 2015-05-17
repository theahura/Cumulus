var client = new Dropbox.Client({ key: "vnlh7u07wr7cqxm" });


client.authenticate(function(error, client) {
  if (error) {
    // Replace with a call to your own error-handling code.
    //
    // Don't forget to return from the callback, so you don't execute the code
    // that assumes everything went well.
    console.log(error);
    return alert(error);
  }

  console.log(client);
});