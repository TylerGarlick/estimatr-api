'use strict';

module.exports = function () {
  return {
    files: [
      'lib/**/*',
      'config/**/*',
      'test/helper.js',
      { pattern: 'test/**/*.test.js', ignore: true }
    ],

    tests: [
      'test/**/*.test.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    bootstrap: function () {
      require('./test/helper');
    },

    workers: { recycle: true, initial: 1, regular: 1 }

  };
};