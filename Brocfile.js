// An object for keeping references to Broccoli plugins
var plugins = process.plugins = {};

var config = function(name) {
  return require('./tasks/broccoli/' + name);
};

// Convert Broccoli plugin names into camelized strings
var camelize = config('camelize');

// Looks at dependencies specified in package.json, requires broccoli plugins
// and adds them to the plugins object.
require('matchdep').filterDev('broccoli-*').forEach(function(p, idx) {
  // Avoid errors. Do not require CLI dependencies
  if (['broccoli-cli', 'broccoli-timepiece'].indexOf(p) < 0) {
    plugins[camelize(p.replace(/^broccoli-/, ''))] = require(p);
  }
});

var lib = 'lib',
    styles = config('styles')('styles'),
    examples = 'examples',
    env = plugins.env.getEnv(),
    sourceTrees,
    pkg;

// Combine code and styles into a single tree
sourceTrees = [lib, styles];
pkg = new plugins.mergeTrees(sourceTrees, { overwrite: true });

// Compile all the things!
pkg = config('preprocess')(pkg);

// module.exports = pkg; return; // Stop here to inspect package structure

var outputJs = config('dist_es6_module')(pkg);

// Watch the examples directory in development
if (env === 'development') {
  outputJs = plugins.mergeTrees([outputJs, config('examples')(examples), config('bower')()]);
}

module.exports = outputJs;
