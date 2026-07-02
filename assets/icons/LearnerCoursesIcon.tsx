/* eslint-disable max-len */
import Svg, { Path } from 'react-native-svg';
import { ICON } from '../../src/styles/metrics';

type LearnerCoursesIconProps = {
  style?: object,
  size?: number,
}

const LearnerCoursesIcon = ({ style, size = ICON.MD }: LearnerCoursesIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path d="M7 5H5V19H19V5H17V15C17 15.17 16.96 15.34 16.88 15.49C16.79 15.64 16.67 15.77 16.53 15.86C16.38 15.947 16.22 16 16.04 16.006C15.87 16.01 15.703 15.98 15.55 15.9L12 14.11L8.45 15.88C8.3 15.96 8.13 15.99 7.96 15.99C7.79 15.98 7.63 15.93 7.48 15.84C7.34 15.75 7.22 15.63 7.13 15.48C7.05 15.34 7 15.17 7 15V5ZM5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V19C21 19.53 20.79 20.04 20.41 20.41C20.04 20.79 19.53 21 19 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 3.9 3.9 3 5 3ZM9 5V13.38L11.55 12.11C11.69 12.04 11.84 12.003 12 12.003C12.16 12.003 12.31 12.04 12.45 12.11L15 13.38V5H9Z" fill="#3D2E38"/>
  </Svg>
);

export default LearnerCoursesIcon;
