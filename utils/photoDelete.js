const path = require("path");
const fs = require("fs");

/**
 * Deletes picture inside upload folder.
 * @param {string} pictureFilename
 * @param {string} folderPath
 * @returns {boolean} True if deleted, false otherwise
 */

module.exports = function (pictureFilename, folderPath) {
  const targetPath = path.join(
    __dirname,
    `../upload/${folderPath}/${pictureFilename}`
  );

  fs.unlink(targetPath, function (err) {
    if (err) return false;
  });

  return true;
};
