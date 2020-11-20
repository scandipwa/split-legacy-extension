const { exit } = require('process');
const path = require('path');
const fs = require('fs-extra');

module.exports = function(basePath) {
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
}
