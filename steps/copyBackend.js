const fs = require('fs-extra');
const path = require('path');
const { exit } = require('process');

const copyFilesIfExist = require('../util/copyFilesIfExist');
const { copyFilesFE } = require('./copyFrontend');

const notCopyFilesBE = [
	...copyFilesFE,
	'src/scandipwa',
	'scandipwa',
	'.git'
];

const copyFilesBE = [
	'composer.json',
	'composer.lock',
	'LICENSE',
	'README.md',
	'.gitignore'
]

const getBeSource = (source) => {
	if (fs.existsSync(path.join(source, 'registration.php'))) {
		return source;
	}

	return path.join(source, 'src');
}

const copyBackend = (source, beDestination) => {
	if (fs.existsSync(beDestination)) {
        console.error(`Directory ${beDestination} already exists! Aborting.`);
        exit(255);
	}
	fs.mkdirSync(beDestination);

	// Copy BE code
	const beSource = getBeSource(source);
	fs.copySync(
		beSource,
		beDestination,
		{ 
			filter: (file) => !notCopyFilesBE.find(
				entry => {
					if (typeof entry === 'string') {
						return file.startsWith(path.join(beSource, entry));
					}	

					return file.startsWith(path.join(beSource, Object.keys(entry)[0]));
				}
			) 
		}
	)

	copyFilesIfExist(source, beDestination, copyFilesBE);
}

module.exports = {
    copyBackend,
    copyFilesBE
}
