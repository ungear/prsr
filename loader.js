const https = require("https");
const fs = require("fs");
const path = require("path");
const { readTags } = require("./tagsProcessor");

module.exports.asyncDownloaderFactory = function(downloadDirPath) {
  return function(url) {
    return new Promise((resolve, reject) => {
      let filename = url.replace(/.*\/(.*).mp3.*/, "$1") + ".mp3";
      //console.log("started " + filename);
      var request = https
        .get(url, function(response) {
          let filePath = path.resolve(downloadDirPath, filename);
          let file = fs.createWriteStream(filePath);
          response.pipe(file);
          response.on("end", async _ => {
            let tags = await readTags(file.path);
            //console.log(tags);
            if (tags && tags.title) {
              fs.rename(
                filePath,
                path.resolve(downloadDirPath, tags.title + ".mp3")
              );
            }
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
