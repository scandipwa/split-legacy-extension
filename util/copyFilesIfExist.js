const fs = require('fs-extra');
const path = require('path');

const getSourceAndTargetPaths = (file, source, destination) => {
	if (typeof file === 'string') {
		return { 
			sourcePath: path.join(source, file),
			targetPath: path.join(destination, file)
		};
	}

	const sourceFile = Object.keys(file)[0];
	const targetFile = Object.values(file)[0];

	return {
		sourcePath: path.join(source, sourceFile),
		targetPath: path.join(destination, targetFile)
	};
}

/**
 *
 * @param {string} source
 * @param {string} destination
 * @param {string[]} fileArr
 */
const copyFilesIfExist = (source, destination, fileArr) => {
	// Copy BE meta
	fileArr.forEach((file) => {
		const { sourcePath, targetPath } = getSourceAndTargetPaths(file, source, destination);
		if (!fs.existsSync(sourcePath)) {
			return;
		}

		// Ensure the target directory
		fs.ensureDirSync(path.dirname(targetPath));

		// Copy the file
		fs.copySync(sourcePath, targetPath);
	});
}

module.exports = copyFilesIfExist;