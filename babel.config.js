// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const shouldLimitConsoleLogs =
  process.env.REACT_APP_LIMIT_CONSOLE_LOGS === '1' ||
  process.env.REACT_APP_LIMIT_CONSOLE_LOGS === 'true';

module.exports = api => {
  const babelEnv = api.env();

  // plugins common for all environment
  const plugins = [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    ['module:react-native-dotenv'],
    '@amazon-devices/react-native-reanimated/plugin',
  ];

  // plugins pushed only for "development" env
  if (babelEnv === 'development') {
    if (shouldLimitConsoleLogs) {
      // NOTE: strips all console logs except warn and errors
      plugins.push([
        'transform-remove-console',
        { exclude: ['error', 'warn'] },
      ]);
    }
  }

  // plugins pushed only for "production" env
  if (babelEnv === 'production') {
    plugins.push([
      'transform-remove-console',
      { exclude: ['error', 'info', 'warn'] },
    ]);
  }

  const presets = [
    [
      'module:metro-react-native-babel-preset',
      { useTransformReactJSXExperimental: true },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
