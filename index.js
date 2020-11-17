console.clear();

/**
 * 0. Locate the <vendor>/<extension> directory inside of the given path
 * 1. Create new directories for FE and BE parts
 * 2. Copy the FE part to the FE' directory
 * 3. Copy the BE part to the BE' directory
 */

const DEFAULT_PUBLISHER = '@scandipwa';

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const { exit } = require('process');

const args = process.argv.slice(2);
const sourceDirArg = args[0];
const destDirArg = args[1];

/**
 * @returns {{ vendorName: string, extensionName: string, basePath: string }}
 */
const getBaseParams = () => {
	const basePath = path.resolve(process.cwd(), sourceDirArg);

	const handlePlain = () => {
		const parseName = name => name.replace('@', '').split('/');

		const packageName = [
			path.join(basePath, 'package.json'),
			path.join(basePath, 'composer.json')
		].reduce(
			(acc, cur) => acc || fs.existsSync(cur) && require(cur).name
		);

		if (!packageName) {
			throw new Error('Could not retrieve this package\'s name neither from package.json nor from composer.json!');
		}

		const [beforeSlash, afterSlash] = parseName(packageName);
		if (!afterSlash) {
			return {
				extensionName: beforeSlash,
				basePath
			}
		}

		return {
			vendorName: beforeSlash,
			extensionName: afterSlash,
			basePath
		}
	}

	const handleNested = () => {
		const appCodePath = path.join(basePath, 'code');
		const appCodeContents = fs.readdirSync(appCodePath);

		if (appCodeContents.length > 1) {
			throw new Error('Multiple vendors in app/code of a single extension are not allowed.');
		} else if (appCodeContents.length < 1) {
			throw new Error('No vendors found in app/code of this extension');
		}

		const vendorName = appCodeContents[0];

		const appCodeVendorPath = path.join(appCodePath, vendorName);
		const appCodeVendorContents = fs.readdirSync(appCodeVendorPath);

		if (appCodeVendorContents.length > 1) {
			throw new Error('Extensions consisting of multiple modules are not allowed');
		} else if (appCodeVendorContents.length < 1) {
			throw new Error('No modules found in app/code/<vendor>!');
		}

		const extensionName = appCodeVendorContents[0];

		return {
			vendorName,
			extensionName,
			basePath: path.join(appCodeVendorPath, extensionName)
		};
	}

	if (!/^(.\/)?app$/.test(sourceDirArg)) {
		return handlePlain();
	} else {
		return handleNested();
	}
}

getDefaultPublisher = () => {
	console.warn(
		'Scope (publisher) name not defined, defaulting to "@scandipwa".\n' +
		'Please remember to correct this in your package.json after this transformation.'
	);

	return DEFAULT_PUBLISHER;
}

const {
	vendorName = getDefaultPublisher(),
	extensionName,
	basePath
} = getBaseParams();

const expectedFePath = path.join(basePath, 'src', 'scandipwa');
const feExists = fs.existsSync(expectedFePath);

if (!feExists) {
	console.log(
		'This extension does not contain a FE part.\n' +
		'Hence, transforming it is unnecessary, this is a BE-only extension.\n'
	);

	exit(0);
}

const expectedBePaths = [
	path.join(basePath, 'registration.php'),
	path.join(basePath, 'src', 'registration.php')
];
const beExists = expectedBePaths.reduce(
	(acc, expectedBePath) => acc || fs.existsSync(expectedBePath),
	false
);

if (!beExists) {
	console.log(
		'This extension does not contain a BE part.\n' +
		'Hence, transforming it is unnecessary, this is a FE-only extension.\n'
	);

	exit(0);
}

const destinationBase = path.join(
	process.cwd(),
	destDirArg || `${vendorName}-${extensionName}-reformatted`
);

const copyFrontend = () => {
	const copyFilesFE = [
		'package.json',
		'package-lock.json',
		'.npmrc',
	];

	/**
	 * Create the new FE directory
	 */
	const newFeDirPath = path.join(destinationBase, `${extensionName}-frontend`);
	if (fs.existsSync(newFeDirPath)) {
		throw new Error(`Directory ${newFeDirPath} already exists! Aborting.`);
	}
	fs.mkdirSync(newFeDirPath);

	/**
	 * Copy all the src/scandipwa directory into the new FE module
	 */
	const baseFeDir = path.join(basePath, 'src', 'scandipwa');
	fs.readdirSync(baseFeDir).forEach((entry) => fse.copySync(
		path.join(baseFeDir, entry),
		newFeDirPath
	));

	/**
	 * Copy the additional files into the new FE module
	 */
	copyFilesFE.forEach((fileRelative) => fse.copySync(
		path.join(basePath, fileRelative),
		newFeDirPath
	));
}

const copyBackend = () => {
	const ignoreFiles = [
		'src',
		'package-lock.json',
		'package.json',
		'scandipwa'
	];

	/**
	 * Create the new BE directory
	 */
	const newBeDirPath = path.join(destinationBase, `${extensionName}-backend`);
	if (fs.existsSync(newBeDirPath)) {
		throw new Error(`Directory ${newBeDirPath} already exists! Aborting.`);
	}
	fs.mkdirSync(newBeDirPath);

	/**
	 * Copy all the BE-related files to the new BE module
	 */
	const baseBeDir = fs.existsSync(path.join(basePath, 'registration.php'))
		? basePath
		: path.join(basePath, 'src');

	fs.readdirSync(baseBeDir)
		.filter((entry) => !ignoreFiles.includes(entry))
		.forEach((entry) => fse.copySync(
			path.join(baseBeDir, entry),
			newBeDirPath
		));
}

