module.exports = function(karma){
  karma.set({
    // register the framework (it needs to go before mocha / jasmine) 
    frameworks: ['jasmine'],

    singleRun:true,

    files: [
      "./config.js",
      "./chart.js",
      "./angular.min.js",
      "./angular-*.js",
      "./select.js",
      "./teamforgeChartsApp.js",
      "./tests/*-test.js"
    ],
 
    browsers: ['PhantomJS']
  });
};
