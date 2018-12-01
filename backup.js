module.exports = function () {

let {spawn} = require('child_process');
let Client = require('ftp');
const cron = require('node-cron'); 


//Task Scheduler
cron.schedule('0 0 * * *', function () {

//Zip File
let zip = spawn('zip', ['-r', 'node.zip', '/opt/node']);

zip.stdout.on('data', function(data){

console.log(`stdout: ${data}`);
});

//FTP Tranfer
let ftp = new Client();

  ftp.on('ready', function() {

    ftp.put('node.zip','/nodebk/node.zip',  function(err) {
      if (err) throw err;

       console.log('Upload Complete');

      ftp.end();
    });

    });

  // connect to server
  ftp.connect({host:'98.191.99.68', user:'jasen', password:'Jbone2424!!'});



});

};
