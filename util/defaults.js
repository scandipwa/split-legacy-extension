const DEFAULT_PUBLISHER_NAME = 'scandipwa';

const getDefaultPublisherNameGetter = (extensionName) => {
    let warned = false;
    return () => {
        if (!warned) {
            console.warn(
                `Publisher name not found for extension ${extensionName}\n` +
                `Defaulting to ${DEFAULT_PUBLISHER_NAME}`
            );
            warned = true;
        }

        return DEFAULT_PUBLISHER_NAME;
    }
}

module.exports = {
	getDefaultPublisherName: getDefaultPublisherNameGetter()
};
