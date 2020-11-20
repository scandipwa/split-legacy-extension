const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { getDefaultPublisherName } = require('../util/defaults');

const initNpmModule = (targetPath, pkgName, pkgPublisher = getDefaultPublisherName()) => {
    exec(
        'npm init --yes',
        { cwd: targetPath },
        (error, stdout, stderr) => {
            if (error) throw error;

            // Read the generated package.json
            const packageJsonPath = path.join(targetPath, 'package.json');
            const packageJson = require(packageJsonPath);

            // Set proper name
            packageJson.name = `@${pkgPublisher}/${pkgName}`;

            // Set proper license
            if (fs.existsSync(path.join(targetPath, 'LICENSE'))) {
                packageJson.license = 'SEE LICENSE IN LICENSE'
            }

            // Write back to the file
            fs.writeFileSync(JSON.stringify(packageJson));

            console.warn(
                `An npm package has been initialized at ${targetPath}\n` +
                'Please update the package.json file with relevant information!\n'
            );
        }
    );
}

module.exports = (feDestination) => {
    if (!fs.existsSync(path.join(feDestination, 'package.json'))) {
        initNpmModule(feDestination);
    }
}