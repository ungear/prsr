var https = require("https");
var fs = require("fs");
var path = require("path");

const DOWNLOAD_DIR_PATH = "./download";

if (!fs.existsSync(DOWNLOAD_DIR_PATH)) {
  console.log("/download directory has been created");
  fs.mkdirSync(DOWNLOAD_DIR_PATH);
}

var entries = require("./data.json").log.entries;
var goalUrls = entries
  .map(x => x.request.url)
  .filter(x => /^https:\/\/.*\.mp3\?extra/.test(x));

downloading(goalUrls);

async function downloading(urls){
    let loader = asyncLoadingGenerator(urls);
    for await (let x of loader){
      console.log("downloaded file: " + x)
    }
}

async function* asyncLoadingGenerator(urlList){
  while(urlList.length){
    let f = await downloadFileAsync(urlList.pop())
    yield f;
  }
}

function downloadFileAsync(url) {
  return new Promise((resolve, reject) => {
    let filename = url.replace(/.*\/(.*).mp3.*/, "$1") + ".mp3";
    var file = fs.createWriteStream(path.resolve(DOWNLOAD_DIR_PATH, filename));
    var request = https.get(url, function(response) {
      console.log("started " + filename);
      response.pipe(file);
      response.on("end", _ => {
        console.log("finish " + filename);
        resolve(filename);
      });
    });
  });
}
