/* eslint-disable max-len */
import Svg, { Path } from 'react-native-svg';
import { ICON } from '../../src/styles/metrics';

type TrainerCoursesIconProps = {
  style?: object,
  size?: number,
}

const TrainerCoursesIcon = ({ style, size = ICON.MD }: TrainerCoursesIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" style={style}>
    <Path fill="#3D2E38" stroke="#3D2E38" strokeWidth="0.8" d="M21.067 4V3.6H20.667H11.05C11.01 3.19 10.91 2.78 10.76 2.4H20.667C21.09 2.4 21.5 2.57 21.8 2.87C22.1 3.17 22.267 3.58 22.267 4V15C22.267 15.42 22.1 15.83 21.8 16.13C21.5 16.43 21.09 16.6 20.667 16.6H12.067V15.4H20.667H21.067V15V4ZM3.67 13.6H2.57V9C2.57 8.58 2.74 8.17 3.04 7.87C3.34 7.57 3.74 7.4 4.17 7.4H15.267V8.6H9.67H9.27V9V21.6H8.07V16V15.6H7.67H5.67H5.27V16V21.6H4.07V14V13.6H3.67ZM8.27 4C8.27 4.42 8.1 4.83 7.8 5.13C7.5 5.43 7.09 5.6 6.67 5.6C6.24 5.6 5.84 5.43 5.54 5.13C5.24 4.83 5.07 4.42 5.07 4C5.07 3.58 5.24 3.17 5.54 2.87C5.84 2.57 6.24 2.4 6.67 2.4C7.09 2.4 7.5 2.57 7.8 2.87C8.1 3.17 8.27 3.58 8.27 4Z" />
  </Svg>
);

export default TrainerCoursesIcon;
