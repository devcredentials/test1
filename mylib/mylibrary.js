var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var request = require('request');

var DOWNLOAD_DIR = './downloads/';
var file_url = 'http://n3.sdlcdn.com/imgs/b/a/e/198x232/Micromax-Canvas-Nitro-4G-E455-SDL544433908-1-e5e7f.jpg';

module.exports={
     downloadFile : function(uri, filename, callback){//Downlaod file with request
       console.log("1111");
        request.head(uri, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
          //request(uri).pipe(fs.createWriteStream(DOWNLOAD_DIR + filename)).on('close', callback);
          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
        console.log("3333");
      },

      download_file_httpget : function(file_url,download_Dir) {//downlaod file using http
            var options = {
                host: url.parse(file_url).host,
                port: 80,
                path: url.parse(file_url).pathname
            };
          //  var file_name = url.parse(file_url).pathname.split('/').pop();
            var file_name =download_Dir;
            console.log(file_name);
            var file = fs.createWriteStream(file_name);
            http.get(options, function(res) {
                res.on('data', function(data) {
                        file.write(data);
                    }).on('end', function() {
                        file.end();
                        console.log('file_name +  downloaded to ' + download_Dir);
                    });
            });
      }
};

// Calling Example
// mylib.download_file_httpget(file_url,DOWNLOAD_DIR +'newfile1.jpg');
// mylib.downloadFile(file_url,DOWNLOAD_DIR +'newfile.jpg',function(){console.log("File downloaded.");});
