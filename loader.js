var https = require("https");
var fs = require("fs");
var path = require("path");

module.exports.asyncDownloaderFactory = function(downloadDirPath) {
  return function(url) {
    return new Promise((resolve, reject) => {
      let filename = url.replace(/.*\/(.*).mp3.*/, "$1") + ".mp3";
      //console.log("started " + filename);
      var request = https
        .get(url, function(response) {
          let file = fs.createWriteStream(
            path.resolve(downloadDirPath, filename)
          );
          response.pipe(file);
          response.on("end", _ => {
            //console.log("finish " + filename);
            resolve({ success: true });
          });
        })
        .on("error", error => {
          resolve({ success: false, error });
        });
    });
  };
};
