const getArguments = require('./steps/getArguments');
const handleNoFrontend = require('./steps/handleNoFrontend');
const handleNoBackend = require('./steps/handleNoBackend');
const copyFrontend = require('./steps/copyFrontend');
const copyBackend = require('./steps/copyBackend');
const postProcessFrontend = require('./steps/postProcessFrontend');
const postProcessBackend = require('./steps/postProcessBackend');

const {
	source,
	feDestination,
	beDestination
} = getArguments();

handleNoFrontend(source);
handleNoBackend(source);

copyFrontend(source, feDestination);
copyBackend(source, beDestination);

postProcessFrontend(feDestination);
postProcessBackend(beDestination);
