exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec/integration/**/*_spec.js'],
    capabilities: {
        'browserName': 'chrome' // or 'safari'
    }
};