const fs = require('fs-extra');
const path = require('path');
const copyFilesIfExist = require('../util/copyFilesIfExist');

const ignoreFiles = [
	'package-lock.json',
	'package.json',
	'.npmrc',
	'scandipwa'
];

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

module.exports = (source, beDestination) => {
	if (fs.existsSync(beDestination)) {
		throw new Error(`Directory ${beDestination} already exists! Aborting.`);
	}
	fs.mkdirSync(beDestination);

	// Copy BE code
	const beSource = getBeSource(source);
	fs.copySync(
		beSource,
		beDestination,
		{
			filter: (src, dest) => !ignoreFiles.includes(path.basename(src))
		}
	)

	copyFilesIfExist(source, beDestination, copyFilesBE);
}
