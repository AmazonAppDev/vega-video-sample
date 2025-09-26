// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { AppRegistry, LogBox } from 'react-native';
import { name as appName, syncSourceName } from './app.json';
import App from './src/App';
import LiveForceSync from './src/LiveForceSync';

// Temporary workaround for problem with nested text
// not working currently.
LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(syncSourceName, () => LiveForceSync);
