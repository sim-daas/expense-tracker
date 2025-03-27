const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Export the merged configuration
module.exports = config;
