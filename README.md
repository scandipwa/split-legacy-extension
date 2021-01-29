# ScandiPWA extension splitter

This module is made to split FE and BE parts of a ScandiPWA extension.

### How to use - important!

1. Clone this repository to a convenient place to access. Let's assume that you cloned it to `~`
2. Run `node ~/split-legacy-extension/index.js <source path> [<destination path>]`. Destination path is optional and defaults to `process.cwd()` + `@publisher_extension-name`.
2. See that in your `<destination path>` directory appeared two directories: `frontend` and `backend`. These directories are npm and composer modules, correspondingly. 
3. Validate the new modules. Things to verify:

    1. All first-level children of the initial directory have found their path to the correct modules. E.g. if you have some `.editorconfig` in the root of your initial module, it will not be copied - the variety of files there can be endless and it is ambiguous where should they go. You are expected to handle that yourself. This tool only handles the files vital for the ScandiPWA plugin system.

    2. Both `composer.json` and `package.json` files exist and are valid, with relevant information.

4. Enjoy the FE-only extension in your `create-scandipwa-app` setup and the BE-only module on your M2 instance!
