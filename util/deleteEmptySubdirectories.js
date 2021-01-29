const fs = require('fs');
const path = require('path');

const notActualFiles = [
    '.DS_Store'
];

// Clean up the directory - remove some trash
const deleteNotActualFiles = (target) => notActualFiles.forEach(notActualFileName => {
    const targetItemPath = path.join(target, notActualFileName);

    // Delete files, ignore directories
    if (fs.existsSync(targetItemPath) && !fs.lstatSync(targetItemPath).isDirectory()) {
        fs.unlinkSync(targetItemPath);
    }
});

// Return true if the given directory is empty
const isEmptyDirectory = (target) => fs.readdirSync(target).length === 0;

// Recursively delete all the empty subdirectories in the given path
const deleteEmptySubdirectories = (target) => {
    const dirList = fs.readdirSync(target);

    dirList.forEach(targetItemName => {
        // Is file => return
        const targetChildPath = path.join(target, targetItemName);
        if (!fs.lstatSync(targetChildPath).isDirectory()) {
            return;
        }
        
        // Is directory => recursive
        deleteNotActualFiles(targetChildPath);
        deleteEmptySubdirectories(targetChildPath);

        // At the end is empty => delete
        if (isEmptyDirectory(targetChildPath)) {
            fs.rmdirSync(targetChildPath);
        }
    });
}

module.exports = deleteEmptySubdirectories;
