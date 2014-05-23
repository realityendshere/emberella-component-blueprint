// Regular expression camelization
var STRING_CAMELIZE_REGEXP = (/(\-|_|\.|\s)+(.)?/g);

// An object for keeping references to Broccoli plugins
var plugins = {};

// Convert Handlebars templates and Coffeescript into Javascript
var preprocess = function(tree) {
  // Precompile Handlebars templates
  tree = plugins.emberHbsTemplateCompiler(tree, {module: true});

  // Transpile Coffeescript into Javascript
  tree = plugins.coffee(tree, {
    bare: true
  });

  return tree;
};

// Convert Broccoli plugin names into camelized strings
var camelize = function(str) {
  return str.replace(STRING_CAMELIZE_REGEXP, function(match, separator, chr) {
    return chr ? chr.toUpperCase() : '';
  }).replace(/^([A-Z])/, function(match, separator, chr) {
    return match.toLowerCase();
  });
};

// Looks at dependencies specified in package.json, requires broccoli plugins
// and adds them to the plugins object.
require('matchdep').filterDev('broccoli-*').forEach(function(p, idx) {
  // Avoid errors. Do not require CLI dependencies
  if (['broccoli-cli', 'broccoli-timepiece'].indexOf(p) < 0) {
    plugins[camelize(p.replace(/^broccoli-/, ''))] = require(p);
  }
});

var lib = 'lib',
    styles = 'styles',
    examples = 'examples',
    env = plugins.env.getEnv(),
    sourceTrees,
    pkg,
    css;

// Grab a reference to the 'lib' directory. This is where all the component
// code should be developed
lib = plugins.staticCompiler(lib, {
  srcDir: '/',
  destDir: '/'
});

// Prepare styles located in the "styles" directory
styles = plugins.staticCompiler(styles, {
  srcDir: '/',
  destDir: '/styles'
});

// Convert SASS to CSS
styles = plugins.sass([styles], 'styles/main.scss', 'templates/main-css.css');

// Autoprefixer adds and removes vendor prefixes from stylesheets as needed
styles = plugins.autoprefixer(styles, {});

styles = plugins.csso(styles, {});

// We're using ic-styles, a strategy that injects component styles only when
// this component is used
styles = plugins.fileMover(styles, {
  srcFile: 'templates/main-css.css',
  destFile: 'templates/main-css.hbs'
});

// Combine code and styles into a single tree
sourceTrees = [lib, styles];
pkg = new plugins.mergeTrees(sourceTrees, { overwrite: true });

// Compile all the things!
pkg = preprocess(pkg);

// module.exports = pkg; return; // Stop here to inspect package structure

var outputJs = plugins.distEs6Module(pkg, require('./output'));

// Watch the examples directory in development
if (env === 'development') {
  var bowerFiles = [
    plugins.staticCompiler('bower_components/jquery/dist', {
      files: ['jquery.js'],
      srcDir: '/',
      destDir: '/bower_components/jquery/dist'
    }),

    plugins.staticCompiler('bower_components/handlebars', {
      files: ['handlebars.js'],
      srcDir: '/',
      destDir: '/bower_components/handlebars'
    }),

    plugins.staticCompiler('bower_components/ember', {
      files: ['ember.js'],
      srcDir: '/',
      destDir: '/bower_components/ember/'
    }),

    plugins.staticCompiler('bower_components/ic-styled', {
      files: ['main.js'],
      srcDir: '/',
      destDir: '/bower_components/ic-styled'
    })
  ];

  bowerFiles = plugins.mergeTrees(bowerFiles);

  examples = plugins.staticCompiler(examples, {
    srcDir: '/',
    destDir: '/examples'
  });

  outputJs = plugins.mergeTrees([outputJs, examples, bowerFiles]);
}

module.exports = outputJs;
