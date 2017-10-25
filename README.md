# react-native-tinder-navigator
![demo](https://github.com/joaquindk/react-native-tinder-navigator/blob/master/navigatorDemo.gif)

## Synopsis

This project implements a simple tinder-style navigator as shown in the demo above. It's based on the idea of having three screens that stand alongside each other on the viewport, ie. a central screen and two side-screens, one on the left and onother on the right. Each screen has its own representative icon that is shown on the application's header - the icon of the screen shown in the viewport is always centered, and depending on which screen you're in, the icons of the remaining screens are shown on the left/right edges of the header. Clicking on any of the left/right icons will cause a screen transition, also allowing for the icons themselves to animate while the transition is in progress.

The library takes care of the screen and header transitions, and leaves it up to the user to define animations that occur on the icons during the transitions. In the demo above we show how icons grow/shrink and change color during the transitions.

## Code Example

Setting up a navigator is as simple as this...

```jsx
import React, { Component } from "react";
import { Animated, View } from "react-native";
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

```

An example of the HeaderIcon used in the Demo can be found in the examples in this repository.

## Motivation

The component was implemented due to the lack of this type of transition in other libraries such as react-navigation. At the moment in which this was developed, react-navigation did not provide screen transitions from left to right, and the header transitions were difficult to customise. We have thereafter integrated this project into others that are using react-navigation with excellen results, given that this navigator behaves as any other screen in the app.

## Installation

* `npm install --save react-native-tinder-navigator`

## API Reference

The API is extremely simple. We expose a single HOC (high order component) called `createTinderNavigator` to which you pass down the 3 screens that the navigator is built with, plus some additional props. Here you can find the Flow types for the props passed to the HOC:

```jsx
type Screen = {
  /** Actual screen content */
  component: Class<React$Component<*, *>>,
  /** icon component bound to the screen */
  icon: Class<React$Component<*, *>>,
};

type Params = {
  /** Component used for the left screen. */
  leftScreen: Screen,
  /** Component used for the center screen. */
  centerScreen: Screen,
  /** Component used for the right screen. */
  rightScreen: Screen,
  /** Size of the icons when they are rendered on the left or right side, as inactive components. */
  inactiveSize: number,
  /** Styles passed down to the header. */
  headerStyle: Object,
};
```
## Running the example project

* `git clone https://github.com/joaquindk/react-native-tinder-navigator.git`
* `cd example`
* `npm install`
* `react-native run-ios`

## Contributors

This has just kicked off, so feel free to contribute and improve this. I'll be delighted to help.

## License

MIT
