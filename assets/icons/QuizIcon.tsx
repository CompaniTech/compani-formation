import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { GREY } from '../../src/styles/colors';
import { ICON } from '../../src/styles/metrics';

type QuizIconProps = {
  color?: string,
  style?: object,
  size?: number,
}

const QuizIcon = ({ color = GREY[700], style, size = ICON.XL }: QuizIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Rect x="2" y="2" width="24" height="12" rx="6" fill="white"/>
    <Rect x="6" y="18" width="24" height="12" rx="6" fill="#C8BCC3"/>
    <Circle cx="8" cy="8" r="7" fill="#C8BCC3"/>
    <Circle cx="24" cy="24" r="7" fill="white"/>
    <Circle cx="8" cy="8" r="7" stroke={color} strokeWidth="2"/>
    <Circle cx="24" cy="24" r="7" stroke={color} strokeWidth="2"/>
    <Path d="M6 6L10 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M10 6L6 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M21 24L23 26L27 22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M19 6H31" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Path d="M19 10H31" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export default QuizIcon;
