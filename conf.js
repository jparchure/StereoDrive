exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec/*_spec.js'],
    capabilities: {
        'browserName': 'safari' // or 'safari'
    }
};