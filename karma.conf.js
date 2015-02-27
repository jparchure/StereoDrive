// Karma configuration
// Generated on Wed Feb 25 2015 00:34:04 GMT-0600 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      // we want all templates to be loaded in the same module called 'templates'
      moduleName: 'templates'
    },

    // list of files / patterns to load in the browser
    files: [
        'app/assets/javascripts/angular-app/plugins/angular.min.js',
        'app/assets/javascripts/angular-app/plugins/angular-route.min.js',
        'app/assets/javascripts/angular-app/plugins/*.js',
        'app/assets/javascripts/angular-app/app/**/*.js',
        'spec/unit/**/*_spec.js',
        'spec/unit/mock/*.js',
        'app/assets/templates/*.html',
        //{pattern: 'unit/mock/*.json', watched: true, served: true, included: false}

    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
