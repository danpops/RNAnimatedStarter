import React, {useState} from 'react';
import {StyleSheet, Switch} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import TSIcon from './src/assets/ts-icon.svg';

const SIZE = 200.0;
const LOGO_SIZE = SIZE - 80.0;

enum Colors {
  yellow = '#FBEB4F',
  light = '#E8E8E8',
  dark = '#1E1E1E',
}

const timingOptions: WithTimingConfig = {duration: 600, easing: Easing.ease};

export default function App() {
  const [isActive, setActive] = useState<boolean>(false);

  const scale = useSharedValue(0);
  const progress = useSharedValue(1);
  const opacity = useSharedValue(0);

  const colorStyle = useDerivedValue(() => {
    return isActive
      ? withTiming(1, timingOptions)
      : withTiming(0, timingOptions);
  });

  const animatedSquare = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorStyle.value,
      [0, 1],
      [Colors.light, Colors.yellow],
    );

    return {
      backgroundColor,
      borderRadius: (progress.value * SIZE) / 2,
      opacity: opacity.value,
      transform: [
        {scale: scale.value},
        {rotate: `${progress.value * Math.PI * 4}rad`},
      ],
    };
  });

  const animatedBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorStyle.value,
      [0, 1],
      [Colors.dark, Colors.light],
    );
    return {backgroundColor};
  });

  const toggleTheme = () => {
    setActive(!isActive);
    scale.value = isActive
      ? withTiming(0, timingOptions)
      : withRepeat(
          withSequence(
            withTiming(1.3, timingOptions),
            withTiming(1, timingOptions),
          ),
          -1,
          true,
        );
    progress.value = isActive
      ? withTiming(1, timingOptions)
      : withTiming(0.5, timingOptions);
    opacity.value = isActive
      ? withTiming(0, timingOptions)
      : withTiming(1, timingOptions);
  };

  return (
    <Animated.View style={[styles.container, animatedBackground]}>
      <Animated.View style={[styles.square, animatedSquare]}>
        <TSIcon width={LOGO_SIZE} height={LOGO_SIZE} fill={Colors.dark} />
      </Animated.View>
      <Switch
        style={styles.switch}
        value={isActive}
        onValueChange={toggleTheme}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light,
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: Colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 0,
  },
  switch: {
    marginTop: 100,
  },
});
