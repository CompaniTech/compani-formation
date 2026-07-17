/* eslint-disable max-len */
import Svg, { Path, Rect } from 'react-native-svg';
import { GREY } from '../../src/styles/colors';
import { ICON } from '../../src/styles/metrics';

type VideoIconProps = {
  color?: string,
  style?: object,
  size?: number,
}

const VideoIcon = ({ color = GREY[700], style, size = ICON.XL }: VideoIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
    <Rect x="2" y="2" width="28" height="28" fill="white"/>
    <Rect x="7" y="2" width="18" height="28" fill="#C8BCC3"/>
    <Path d="M27.73 1H4.27C2.46 1 1 2.46 1 4.27V27.73C1 29.536 2.46 31 4.27 31H27.73C29.536 31 31 29.536 31 27.73V4.27C31 2.46 29.536 1 27.73 1Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 1V31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M25 1V31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 16L31 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 6H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M25 6H31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 21H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M25 21H31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 11H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M25 11H31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M1 26H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M25 26H31" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default VideoIcon;
