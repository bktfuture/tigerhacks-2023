module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			// Required for expo-router
			'expo-router/babel',
			[
				'module:react-native-dotenv',
				{
                    envName: "API_URL",
					moduleName: '@env',
					path: '.env',
				},
			],
		],
	};
};