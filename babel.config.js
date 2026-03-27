// babel-preset-expo lives inside expo's node_modules (not at top level)
const babelPresetExpo = require('./node_modules/expo/node_modules/babel-preset-expo');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        babelPresetExpo,
        {
          // We don't use react-native-reanimated anywhere in this project.
          // Disabling its babel plugin avoids the missing react-native-worklets dep.
          reanimated: false,
        },
      ],
    ],
  };
};
