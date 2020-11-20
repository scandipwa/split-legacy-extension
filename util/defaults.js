const DEFAULT_PUBLISHER_NAME = 'scandipwa';

const warned = {
    publisher: false
};

const getDefaultPublisherName = () => {
    if (!warned.publisher) {
        console.log(`Publisher name not found for this extension! Defaulting to ${DEFAULT_PUBLISHER_NAME}`);
        warned.publisher = true;
    }

    return DEFAULT_PUBLISHER_NAME;
}

module.exports = {
	getDefaultPublisherName
};
