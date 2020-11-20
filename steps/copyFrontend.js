const fs = require('fs-extra');
const path = require('path');
const copyFilesIfExist = require('../util/copyFilesIfExist');
const { exec } = require('child_process');

const copyFilesFE = [
	'package.json',
	'package-lock.json',
	'LICENSE',
	'README.md',
	'.npmrc',
];

module.exports = (source, feRoot) => {
    const feSrc = path.join(feRoot, 'src');
	if (fs.existsSync(feRoot)) {
		throw new Error(`Directory ${feRoot} already exists! Aborting.`);
	}
    fs.mkdirSync(feRoot);
    fs.mkdirSync(feSrc);

	// Copy FE code
	const feSource = path.join(source, 'src', 'scandipwa', 'app');
	fs.copySync(feSource, feSrc);

	// Copy FE meta
    copyFilesIfExist(source, feRoot, copyFilesFE);
}
