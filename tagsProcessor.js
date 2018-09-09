const NodeID3 = require("node-id3");

module.exports.readTags = function(filepath) {
  return new Promise((resolve, reject) => {
    NodeID3.read(filepath, function(err, tags) {
      if (err) reject(err);
      else resolve(tags);
    });
  });
};
