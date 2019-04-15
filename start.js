// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
// eslint-disable-next-line import/no-extraneous-dependencies
require('babel-register')({
  presets: ['env'],
});

// Import the rest of our application.
module.exports = require('./server.js');
