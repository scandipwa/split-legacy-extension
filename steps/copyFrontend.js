const fs = require('fs-extra');
const path = require('path');
const copyFilesIfExist = require('../util/copyFilesIfExist');

const copyFilesFE = [
	'package.json',
	'package-lock.json',
	'LICENSE',
	'README.md',
    '.npmrc',
    '.eslintrc',
    'src/scandipwa/app'
];

const copyFrontend = (source, feRoot) => {
    const feSrc = path.join(feRoot, 'src');
	if (fs.existsSync(feRoot)) {
		throw new Error(`Directory ${feRoot} already exists! Aborting.`);
	}
    fs.mkdirSync(feRoot);
    fs.mkdirSync(feSrc);

	// Copy FE meta
    copyFilesIfExist(source, feRoot, copyFilesFE);
}

module.exports = {
    copyFrontend,
    copyFilesFE
};
