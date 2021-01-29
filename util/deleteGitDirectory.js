const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

const deleteGitDirectory = (target) => {
    const targetGitDirectory = path.join(target, '.git');
    if (!fs.existsSync(targetGitDirectory)) {
        return;
    }

    rimraf(targetGitDirectory);
};

module.exports = deleteGitDirectory;