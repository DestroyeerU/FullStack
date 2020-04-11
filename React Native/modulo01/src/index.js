import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';

import Routes from './routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7f2ed0" />
      <Routes />
      {/* <View /> */}
    </>
  );
}
