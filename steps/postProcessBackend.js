const path = require('path');
const fs = require('fs');

const leadingSrcDirectoryRegExp = /^(.\/)?src(\/|$)/;

/**
 * The PSR-4 mapping must be removed, it is no longer valid
 * Due to BE modules not having ./src directory anymore
 * @param {object} composerJson
 */
const removePsr4 = (composerJson) => {
	if (!'autoload' in composerJson || !'psr-4' in composerJson.autoload) {
		return;
	}

	const { autoload: { 'psr-4': psr4 = {} } } = composerJson;

	for (key in psr4) {
		const value = psr4[key];

		if (typeof value === 'string' && leadingSrcDirectoryRegExp.test(value)) {
			delete psr4[key];
		}
	}

	composerJson.autoload['psr-4'] = psr4;

	if (!Object.keys(psr4).length) {
		delete composerJson.autoload['psr-4'];
	}
}

/**
 * The ./src directory must be removed from the autoloaded files
 * Due to BE modules not having ./src directory anymore
 * @param {object} composerJson
 */
const removeSrcFromAutoload = (composerJson) => {
	if (
		!'autoload' in composerJson ||
		!'files' in composerJson.autoload ||
		!Array.isArray(composerJson.autoload.files)
	) {
		return;
	}

	composerJson.autoload.files = composerJson.autoload.files.map(
		filePath => filePath.replace(leadingSrcDirectoryRegExp, '')
	)
}

module.exports = (beDestination) => {
	const composerJsonPath = path.join(beDestination, 'composer.json');

	if (fs.existsSync(composerJsonPath)) {
		const composerJson = require(composerJsonPath);

		removePsr4(composerJson);
		removeSrcFromAutoload(composerJson);

		fs.writeFileSync(composerJsonPath, JSON.stringify(composerJson, null, 4));
	}
}
