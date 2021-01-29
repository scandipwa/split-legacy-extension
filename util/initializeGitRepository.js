const { execSync } = require('child_process');

const initializeGitRepository = (cwd) => {
    execSync(
        'git init',
        { cwd },
        (error) => {
            if (error) {
                console.error(error);
            }

            console.warn('Unable to initialize git repository! Please, do that manually.');
        }
    );
}

module.exports = initializeGitRepository;
