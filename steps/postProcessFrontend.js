const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { exit } = require('process');

const deleteEmptySubdirectories = require('../util/deleteEmptySubdirectories');

const initNpmModule = (targetPath) => {
    execSync(
        'npm init --yes',
        { cwd: targetPath },
        (error) => {
            if (error) {
                console.error(error);
                exit(255);
            }

            console.warn(
                `An npm package has been initialized at ${targetPath}\n` +
                'Please make sure the package.json contains relevant information!\n'
            );
        }
    );
}

const getPackageNameFromComposerJson = (beDestination) => {
    const composerJsonPath = path.join(beDestination, 'composer.json');
    if (!fs.existsSync(composerJsonPath)) {
        return null;
    }

    const { name } = require(composerJsonPath);
    if (!name.includes('/')) {
        return null;
    }

    return '@'.concat(name);
}

const updatePackageJson = (targetPath, hasInitialised, composerPackageName) => {
    // Read the generated package.json
    const packageJsonPath = path.join(targetPath, 'package.json');
    const packageJson = require(packageJsonPath);

    if (hasInitialised && composerPackageName) {
        // Set proper name
        packageJson.name = composerPackageName;
    }

    // Set scandipwa field
    packageJson.scandipwa = {
        "type": "extension"
    };

    // Set proper license (if exists)
    if (fs.existsSync(path.join(targetPath, 'LICENSE'))) {
        packageJson.license = 'SEE LICENSE IN LICENSE'
    }

    // Write back to the file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
}

module.exports = ({ feDestination, beDestination }) => {
    let hasInitialised = false;

    // Initialize npm module if it is not yet initialised
    if (!fs.existsSync(path.join(feDestination, 'package.json'))) {
        initNpmModule(feDestination);
        hasInitialised = true;
    }

    // Use the composer.json package name for the future
    const composerPackageName = getPackageNameFromComposerJson(beDestination);

    // Modify the composer.json to have the proper data
    updatePackageJson(feDestination, hasInitialised, composerPackageName);

    // Clean up
    deleteEmptySubdirectories(feDestination);
    deleteGitDirectory(feDestination);
    
    // Initialize git repository
	initializeGitRepository(feDestination)
}