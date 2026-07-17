/* eslint-disable max-len */
import Svg, { Path, Rect } from 'react-native-svg';
import { GREY } from '../../src/styles/colors';
import { ICON } from '../../src/styles/metrics';

type LessonIconProps = {
  color?: string,
  style?: object,
  size?: number,
}

const LessonIcon = ({ color = GREY[700], style, size = ICON.XL }: LessonIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Path d="M1 3H8.5L16 5.5L23.5 3H31V26H1V3Z" fill="white"/>
    <Rect x="1" y="24" width="30" height="7" fill="#C8BCC3"/>
    <Path d="M1 3H10C11.59 3 13.12 3.56 14.24 4.56C15.37 5.56 16 6.92 16 8.33V27C16 25.94 15.53 24.92 14.682 24.17C13.84 23.42 12.69 23 11.5 23H1V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M31 3H22C20.41 3 18.88 3.56 17.76 4.56C16.63 5.56 16 6.92 16 8.33V27C16 25.94 16.47 24.92 17.318 24.17C18.16 23.42 19.31 23 20.5 23H31V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 23V27M31 23V27M1 27V31H16M1 27H16M16 27V31M16 27H31M16 31H31V27" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 9H11" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M21 9H27" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M5 13H11" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M21 13H27" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M5 17H11" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M21 17H27" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export default LessonIcon;
