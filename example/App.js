import React, { Component } from "react";
import { View } from "react-native";
import { createTinderNavigator } from 'react-native-tinder-navigator';
import HeaderIcon from './src/HeaderIcon';

const ColorScreen = ({ backgroundColor }) => (
  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
    <View style={{ width: 300, height: 500, backgroundColor }} />
  </View>
);

const MainNavigator = createTinderNavigator({
  leftScreen: { component: () => <ColorScreen backgroundColor="red" />, icon: (props: any) => <HeaderIcon type="flag" {...props} /> },
  centerScreen: { component: () => <ColorScreen backgroundColor="yellow" />, icon: (props: any) => <HeaderIcon type="bed" {...props} /> },
  rightScreen: { component: () => <ColorScreen backgroundColor="green" />, icon: (props: any) => <HeaderIcon type="beer" {...props} /> },
  inactiveSize: 20,
  headerStyle: {
    backgroundColor: "white",
  }
});

const ExampleApp = () => <MainNavigator />;

export default ExampleApp;
