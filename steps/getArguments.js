const path = require('path');
const fs = require('fs-extra');
const { exit } = require('process');

const { getDefaultPublisherName } = require('../util/defaults')

/**
 * @returns {{ sourceArg: string, destArg: string }}
 */
const extractArguments = () => {
	const args = process.argv.slice(2);
	const sourceArg = args[0] || '';
	const destArg = args[1] || '';

	if (!sourceArg) {
		console.log(`Please provide source directory argument!`);
		exit(255);
	}

	return {
		sourceArg: path.resolve(process.cwd(), sourceArg),
		destArg: path.resolve(process.cwd(), destArg)
	}
}

/**
 * @returns {string}
 */
const getExtensionRoot = (sourceArg) => {
	const isNested = root => /^(.\/)?app$/.test(root);

	if (!isNested(sourceArg)) {
		return path.resolve(process.cwd(), sourceArg);
	}

	const appCodePath = path.join(sourceArg, 'app', 'code');
	const appCodeContents = fs.readdirSync(appCodePath);

	if (appCodeContents.length > 1) {
		throw new Error('More than one publisher in app/code! Unexpected, aborting.');
	}

	const publisherName = appCodeContents[0];
	const publisherPath = path.join(appCodePath, publisherName);
	const publisherContents = fs.readdirSync(publisherPath);

	if (publisherContents.length > 1) {
		throw new Error('More than one extension in app/code/<publisher>! Unexpected, aborting.');
	}

	const extensionName = publisherContents[0];
	return path.join(publisherPath, extensionName);
}

/**
 * @returns {string}
 */
const getPackageName = (root) => {
	const packageJsonPath = path.join(root, 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		const { name } = require(packageJsonPath);
		return name;
	}

	const composerJsonPath = path.join(root, 'composer.json');
	if (fs.existsSync(composerJsonPath)) {
		const { name } = require(composerJsonPath);
		return name;
	}

	throw new Error(`Could not find neither package.json nor composer.json at ${root}!`);
}

/**
 * @returns {{ publisherName: string, extensionName: string }}
 */
const getExtensionMeta = (root) => {
	const parseName = name => name.replace('@', '').split('/');
	const packageName = getPackageName(root);

	const [beforeSlash, afterSlash] = parseName(packageName);
	if (!afterSlash) {
		return {
			publisherName: getDefaultPublisherName(),
			extensionName: beforeSlash
		}
	}

	return {
		publisherName: beforeSlash,
		extensionName: afterSlash
	}
}

/**
 * @returns {{ source: string, feDestination: string, beDestination: string }}
 */
const getArguments = () => {
	const {
		sourceArg,
        destArg
	} = extractArguments();

	const source = getExtensionRoot(sourceArg);

	const {
		publisherName,
		extensionName
	} = getExtensionMeta(sourceArg);

    const newName = `${publisherName}--${extensionName}`;

	const feDestination = path.resolve(destArg, `FE__${newName}`);
	const beDestination = path.resolve(destArg, `BE__${newName}`);

	return {
		source,
		feDestination,
		beDestination
	}
}

module.exports = getArguments;
