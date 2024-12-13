const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    server: {
        port: 8081, // Metro'nun çalışacağı port
        host: '192.168.1.23', // Metro'nun çalışacağı IP (bilgisayarınızın IP'sini kullanın)
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
