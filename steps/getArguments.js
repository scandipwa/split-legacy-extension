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
		console.error(`Please provide source directory as the first argument!`);
		exit(255);
	}

	return {
		sourceArg,
		destArg
	}
}

/**
 * @returns {string}
 */
const getExtensionRoot = (sourceArg) => {
    const sourceArgAbsolute = path.resolve(process.cwd(), sourceArg);

	return path.resolve(process.cwd(), sourceArgAbsolute);
}

/**
 * @returns {string}
 */
const getPackageName = (root) => {
	const composerJsonPath = path.join(root, 'composer.json');
	if (fs.existsSync(composerJsonPath)) {
		const { name } = require(composerJsonPath);
		return name;
	}

	const packageJsonPath = path.join(root, 'package.json');
	if (fs.existsSync(packageJsonPath)) {
		const { name } = require(packageJsonPath);
		return name;
	}

    console.error(`Could not find neither package.json nor composer.json at ${root}! Unexpected, aborting.`);
    exit(255);
}

/**
 * @returns {{ publisherName: string, extensionName: string }}
 */
const getExtensionMeta = (root) => {
	const parseName = name => name.replace('@', '').split('/');
	const packageName = getPackageName(root);

	// Package name is expected to be beforeSlash/afterSlash -> publisher/name
	const [beforeSlash, afterSlash] = parseName(packageName);

	// Handle no publisher
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
	} = getExtensionMeta(source);

    const newName = `@${publisherName}_${extensionName}`;

    const destination = path.resolve(process.cwd(), destArg || newName);
	const feDestination = path.resolve(destination, `frontend`);
	const beDestination = path.resolve(destination, `backend`);

	return {
        source,
        destination,
		feDestination,
		beDestination
	}
}

module.exports = getArguments;
