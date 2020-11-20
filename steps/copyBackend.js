const fs = require('fs-extra');
const path = require('path');
const { exit } = require('process');

const copyFilesIfExist = require('../util/copyFilesIfExist');
const { copyFilesFE } = require('./copyFrontend');

const copyFilesBE = [
	'composer.json',
	'composer.lock',
	'LICENSE',
	'README.md'
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
			filter: (src, dest) => !copyFilesFE.find(entry => src.endsWith(entry))
		}
	)

	copyFilesIfExist(source, beDestination, copyFilesBE);
}

module.exports = {
    copyBackend,
    copyFilesBE
}
