const path = require("path");
const fs = require("fs");
const md5 = require("md5");

/**
 * Adds picture inside upload folder.
 * @param {string} base64Picture
 * @param {string} folderPath
 * @returns {(string|null)} Filename of picture in .png or null if
 * invalid {@link base64Picture}.
 */

module.exports = function (base64Picture, folderPath) {
  if (!base64Picture) return null;

  const pictureFilename = md5(new Date().toJSON()) + ".png";
  const targetPath = path.join(
    __dirname,
    `../upload/${folderPath}/${pictureFilename}`
  );

  const buff = Buffer.from(base64Picture, "base64");
  fs.writeFileSync(targetPath, buff);

  return pictureFilename;
};
