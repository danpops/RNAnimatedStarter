import React, {FC} from 'react';
import Animated from 'react-native-reanimated';
import Svg, {Path, PathProps} from 'react-native-svg';
import {Colors} from '../lib/colors';

const AnimatedTSIcon = Animated.createAnimatedComponent(Path);

const SIZE = 120.0;
const VIEW_BOX = '0 0 116 116';
const PATH = `
M58 14.2641V0H116V57.9995H101.735V14.2641H58Z
M14.2649 101.736H57.9999V58.0004H14.2649V101.736ZM0 115.364H72.2639V43.0996H0V115.364Z
`;

const TSIcon: FC<Partial<Animated.AnimateProps<PathProps>> | undefined> = ({
  animatedProps = {},
}) => {
  return (
    <Svg width={SIZE} height={SIZE} viewBox={VIEW_BOX}>
      <AnimatedTSIcon
        animatedProps={animatedProps}
        d={PATH}
        fillRule="evenodd"
        fill={Colors.dark}
      />
    </Svg>
  );
};

export default TSIcon;
