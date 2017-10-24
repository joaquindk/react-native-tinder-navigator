// @flow
import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  View
} from "react-native";

type Screen = {
  /** Actual screen content */
  component: Class<React$Component<*, *>>,
  /** icon component bound to the screen */
  icon: Class<React$Component<*, *>>,
};

type Params = {
  leftScreen: Screen,
  centerScreen: Screen,
  rightScreen: Screen,
  inactiveSize: number,
  headerStyle: Object,
};

type NavigatorState = {
  /** Animating indicator */
  animating: boolean,
  /** Animated delta for the screen transitions */
  screenDeltaX: typeof Animated.Value,
  /** Will be -1, 0, or 1 representing the current screen position (left, center, right) */
  currentPos: number,
};

type NavigatorProps = {};

const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : 0;
const SCREEN_WIDTH = Dimensions.get("window").width; //full width

const BlankScreen = () => (
  <View style={{width: SCREEN_WIDTH}} />
);

const PADDING_HORIZONTAL_SIZE = 15;

const createTinderNavigator = ({ leftScreen, centerScreen, rightScreen, inactiveSize, headerStyle }: Params) => {
  class TinderNavigator extends Component<*, *> {


    constructor(props: NavigatorProps) {
      super(props);

      (this: any).handleNavigateLeft = this.handleNavigateLeft.bind(this);
      (this: any).handleNavigateRight = this.handleNavigateRight.bind(this);

      this.state = {
        animating: false,
        currentPos: 1,
        screenDeltaX: new Animated.Value(1),
      };
    }

    state: NavigatorState;
    props: NavigatorProps;
    arrScreens = [ leftScreen, centerScreen, rightScreen ];

    handleNavigateLeft() {
      const { currentPos } = this.state;
      const nextPos = currentPos - 1;

      this.setState({ animating: true });
      Animated.timing(
        // Animate value over time
        this.state.screenDeltaX, // The value to drive
        { toValue: nextPos }
      ).start(() =>
        this.setState({
          animating: false,
          currentPos: nextPos,
          screenDeltaX: new Animated.Value(nextPos),
        })
      );
    }

    handleNavigateRight() {
      const { currentPos } = this.state;
      const nextPos = currentPos + 1;

      this.setState({ animating: true });
      Animated.timing(
        // Animate value over time
        this.state.screenDeltaX, // The value to drive
        { toValue: nextPos }
      ).start(() =>
        this.setState({
          animating: false,
          currentPos: nextPos,
          screenDeltaX: new Animated.Value(nextPos),
        })
      );
    }

    render() {
      const { screenDeltaX, animating, currentPos } = this.state;

      const LeftIcon = leftScreen.icon;
      const CentralIcon = centerScreen.icon;
      const RightIcon = rightScreen.icon;

      const ScreenBody = this.arrScreens[currentPos].component;
      const LeftScreenBody = currentPos > 0
        ? this.arrScreens[currentPos - 1].component
        : null;
      const RightScreenBody = currentPos < 2
        ? this.arrScreens[currentPos + 1].component
        : null;
      const leftIsActive = currentPos === 0;
      const rightIsActive = currentPos === 2;
      const centerPress = leftIsActive ? this.handleNavigateRight : (rightIsActive ? this.handleNavigateLeft : null);

      return (
        <View style={styles.viewPort}>
          <StatusBar backgroundColor="blue" barStyle="dark-content" />
          <View style={[styles.headerContainer, headerStyle]}>
            <Animated.View
              style={[
                styles.appHeader,
                {
                  transform: [
                    {
                      translateX: screenDeltaX.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [SCREEN_WIDTH / 2 - PADDING_HORIZONTAL_SIZE - inactiveSize/2, 0, -SCREEN_WIDTH / 2 + PADDING_HORIZONTAL_SIZE + inactiveSize/2]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={[styles.iconContainer, { alignItems: 'flex-start'}]}>
                <TouchableOpacity onPress={!leftIsActive ? this.handleNavigateLeft : null}>
                  <LeftIcon
                    active={leftIsActive}
                    animating={animating && currentPos < 2}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.iconContainer, { alignItems: 'center'}]}>
                <CentralIcon active={currentPos === 1} animating={animating} onPress={centerPress ? centerPress : null} />
              </View>
              <View style={[styles.iconContainer , { alignItems: 'flex-end'}]}>
                <TouchableOpacity onPress={!rightIsActive ? this.handleNavigateRight : null}>
                  <RightIcon
                    active={rightIsActive}
                    animating={animating && currentPos > 0}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
          <Animated.View
            style={[
              styles.screensContainer,
              {
                transform: [
                  {
                    translateX: screenDeltaX.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, -SCREEN_WIDTH, -2*SCREEN_WIDTH]
                    })
                  }
                ]
              }
            ]}
          >
            {!RightScreenBody && <BlankScreen />}
            {LeftScreenBody &&
              <View style={styles.screenWrapper} key={`screen${currentPos - 1}`}>
                <LeftScreenBody {...this.props} />
              </View>}
            <View style={styles.screenWrapper} key={`screen${currentPos}`}>
              <ScreenBody {...this.props} />
            </View>
            {RightScreenBody &&
              <View style={styles.screenWrapper} key={`screen${currentPos + 1}`}>
                <RightScreenBody {...this.props} />
              </View>}
            {!LeftScreenBody && <BlankScreen />}
          </Animated.View>
        </View>
      );
    }
  }

  return TinderNavigator;
};

const styles = StyleSheet.create({
  viewPort: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: "column"
  },
  screensContainer: {
    flex: 1,
    flexDirection: "row",
    width: 3 * SCREEN_WIDTH
  },
  screenWrapper: {
    width: SCREEN_WIDTH
  },
  headerContainer: {
    width: SCREEN_WIDTH,
  },
  appHeader: {
    width: SCREEN_WIDTH,
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 10,
    paddingHorizontal: PADDING_HORIZONTAL_SIZE,
    height: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  iconContainer: {
    flex: 1,
    flexGrow: 1,
  }
});

export default createTinderNavigator;
