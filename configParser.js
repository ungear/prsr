module.exports.getResourceUrls = function(jsonPath){
  return require(jsonPath).log.entries
    .map(x => x.request.url)
    .filter(x => /^https:\/\/.*\.mp3\?extra/.test(x));
}