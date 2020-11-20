const { exit } = require('process');
const path = require('path');
const fs = require('fs-extra');

module.exports = function(basePath) {
	const expectedFePath = path.join(basePath, 'src', 'scandipwa', 'app');
	const feExists = fs.existsSync(expectedFePath);

	if (!feExists) {
		console.log(
			'This extension does not contain a FE part.\n' +
			'Hence, transforming it is unnecessary, this is a BE-only extension.\n'
		);

		exit(0);
	}
}
