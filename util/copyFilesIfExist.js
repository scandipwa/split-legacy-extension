const fs = require('fs-extra');
const path = require('path');

/**
 *
 * @param {string} source
 * @param {string} destination
 * @param {string[]} fileArr
 */
module.exports = (source, destination, fileArr) => {
	// Copy BE meta
	fileArr.forEach((filePath) => {
		const copee = path.resolve(source, filePath);
		if (!fs.existsSync(copee)) {
			return;
		}

		const targetPath = path.join(destination, filePath);

		// Ensure the target directory
		fs.ensureDirSync(path.dirname(targetPath));

		// Copy the file
		fs.copySync(
			path.join(source, filePath),
			targetPath
		)
	});
}
