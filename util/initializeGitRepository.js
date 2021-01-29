const { execSync } = require('child_process');

const initializeGitRepository = (cwd) => {
    try {
        execSync('git init', { cwd });
    } catch (error) {
        console.error(error);
        console.warn('Unable to initialize git repository! Please, do that manually.');

        return;
    } 

    try {
        execSync('git add ./*', { cwd });
        execSync('git commit -m "Partly refactor the legacy module"', { cwd });
    } catch (error) {
        console.error(error);
        console.warn('Unable to commit to the new repository! Please, do that manually.');
        
        return;
    } 
}

module.exports = initializeGitRepository;
