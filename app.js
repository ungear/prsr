var fs = require("fs");
var path = require("path");
const { getResourceUrls } = require("./configParser");
const { asyncDownloaderFactory } = require("./loader");

const DOWNLOAD_DIR_PATH = path.resolve("./download");
const CONFIG_PATH = path.resolve("./data.json");

if (!fs.existsSync(CONFIG_PATH)) {
  console.log("Error: Config not found. It is expexted to be located at " + CONFIG_PATH);
  process.exit(1)
}

if (!fs.existsSync(DOWNLOAD_DIR_PATH)) {
  console.log("/download directory has been created");
  fs.mkdirSync(DOWNLOAD_DIR_PATH);
}

let goalUrls = getResourceUrls(CONFIG_PATH);
let asyncDownloader = asyncDownloaderFactory(DOWNLOAD_DIR_PATH);

downloading(goalUrls);

async function downloading(urls){
    let loader = asyncLoadingGenerator(urls);
    let counter = 0;
    for await (let x of loader){
      console.log("Downloaded " +  ++counter + "/" + urls.length)
    }
}

async function* asyncLoadingGenerator(initialUrlList){
  let urlList = initialUrlList.slice();
  while(urlList.length){
    yield await asyncDownloader(urlList.pop())
  }
}