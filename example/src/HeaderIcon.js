// @flow

import React, { Component } from 'react';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type IconProps = {
  /** Icon type used. */
  type: string,
  /** Indicated whether it's currently in focus/active. */
  active: boolean,
  /** Indicated whether the icon is being animated from active to inactive or contrarily. */
  animating: boolean,
};

type IconState = {
  animationDelta: typeof Animated.Value,
};

class HeaderIcon extends Component<IconProps, IconState> {
  constructor(props: IconProps) {
    super(props);

    this.state = {
      animationDelta: new Animated.Value(0),
    };
  }

  state: IconState;

  componentWillReceiveProps(nextProps: IconProps) {
    const { animating } = this.props;

    if (!animating && nextProps.animating) {
      Animated.timing(
        // Animate value over time
        this.state.animationDelta, // The value to drive
        { toValue: 1 }
      ).start(() =>
        this.setState({
          animationDelta: new Animated.Value(0),
        })
      );
    }
  }

  props: IconProps;

  animatedColor = (active: boolean) => {
    const { animationDelta } = this.state;

    return animationDelta.interpolate({
      inputRange: [0, 1],
      outputRange: active
        ? ['rgba(255, 0, 0, 1)', 'rgba(100, 100, 100, 1)']
        : ['rgba(100, 100, 100, 1)', 'rgba(255, 0, 0, 1)'],
    });
  };

  animatedSize = (active: boolean) => {
    const { animationDelta } = this.state;

    return animationDelta.interpolate({
      inputRange: [0, 1],
      outputRange: active ? [30, 20] : [20, 30],
    });
  };

  stateSize = (active: boolean) => {
    return active ? 30 : 20;
  };

  stateColor = (active: boolean) => {
    return active ? 'rgba(255, 0, 0, 1)' : 'rgba(100, 100, 100, 1)';
  };

  render() {
    const { active, animating, type, ...other } = this.props;
    const AnimatedIcon = Animated.createAnimatedComponent(Icon);

    return (
      <AnimatedIcon
        name={type}
        style={{
          color: animating ? this.animatedColor(active) : this.stateColor(active),
          fontSize: animating ? this.animatedSize(active) : this.stateSize(active),
        }}
        {...other}
      />
    );
  }
}

export default HeaderIcon;
