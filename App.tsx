import React, {useState} from 'react';
import {StyleSheet, Switch} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import {Colors} from './src/lib/colors';
import TSIcon from './src/components/TSIcon';

const SQUARE_SIZE = 200.0;
const TIMING_OPTIONS: WithTimingConfig = {duration: 600, easing: Easing.ease};

type InterpolateColorProps = {
  colorStyle: Animated.SharedValue<0 | 1>;
  primary: Colors;
  secondary: Colors;
};

const interpolateColorOptions = ({
  colorStyle,
  primary,
  secondary,
}: InterpolateColorProps) => {
  'worklet';

  return interpolateColor(colorStyle.value, [0, 1], [primary, secondary]);
};

export default function App() {
  const [isActive, setActive] = useState<boolean>(false);

  const scale = useSharedValue(1);
  const progress = useSharedValue(1);
  const opacity = useSharedValue(0.2);

  const colorStyle = useDerivedValue(() => {
    const colorTiming = isActive ? 1 : 0;
    return withTiming(colorTiming, TIMING_OPTIONS);
  });

  const animatedSquare = useAnimatedStyle(() => {
    const backgroundColor = interpolateColorOptions({
      colorStyle,
      primary: Colors.dark,
      secondary: Colors.yellow,
    });

    return {
      backgroundColor,
      borderRadius: (progress.value * SQUARE_SIZE) / 2,
      opacity: opacity.value,
      transform: [
        {scale: scale.value},
        {rotate: `${progress.value * Math.PI * 4}rad`},
      ],
    };
  });

  const animatedProps = useAnimatedProps(() => {
    const fill = interpolateColorOptions({
      colorStyle,
      primary: Colors.yellow,
      secondary: Colors.dark,
    });

    return {
      fill,
    };
  });

  const animatedBackground = useAnimatedStyle(() => {
    const backgroundColor = interpolateColorOptions({
      colorStyle,
      primary: Colors.dark,
      secondary: Colors.light,
    });
    return {
      backgroundColor,
    };
  });

  const toggleTheme = () => {
    setActive(!isActive);

    const progressTiming = isActive ? 1 : 0.5;
    const opacityTiming = isActive ? 0.2 : 1;

    scale.value = isActive
      ? withTiming(1, TIMING_OPTIONS)
      : withRepeat(withTiming(1.3, TIMING_OPTIONS), -1, true);
    progress.value = withTiming(progressTiming, TIMING_OPTIONS);
    opacity.value = withTiming(opacityTiming, TIMING_OPTIONS);
  };

  return (
    <Animated.View style={[styles.container, animatedBackground]}>
      <Animated.View style={[styles.square, animatedSquare]}>
        <TSIcon animatedProps={animatedProps} />
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
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
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
