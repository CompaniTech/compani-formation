/* eslint-disable max-len */
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { GREY } from '../../src/styles/colors';
import { ICON } from '../../src/styles/metrics';

type SharingExperienceIconProps = {
  color?: string,
  style?: object,
  size?: number,
}

const SharingExperienceIcon = ({ color = GREY[700], style, size = ICON.XL }: SharingExperienceIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 33 33" fill="none" style={style}>
    <Circle cx="23" cy="23" r="10" fill="#C8BCC3"/>
    <Rect x="15" y="25" width="16" height="8" rx="4" fill="white"/>
    <Circle cx="23" cy="17" r="4" fill="white"/>
    <Path d="M23 22C21.67 22 20.4 21.47 19.46 20.54C18.53 19.6 18 18.33 18 17C18 15.67 18.53 14.4 19.46 13.46C20.4 12.53 21.67 12 23 12C24.33 12 25.6 12.53 26.54 13.46C27.47 14.4 28 15.67 28 17C28 18.33 27.47 19.6 26.54 20.54C25.6 21.47 24.33 22 23 22ZM23 20C23.394 20 23.78 19.92 24.15 19.77C24.512 19.62 24.84 19.4 25.12 19.12C25.4 18.84 25.62 18.512 25.77 18.15C25.92 17.78 26 17.394 26 17C26 16.606 25.92 16.22 25.77 15.85C25.62 15.488 25.4 15.16 25.12 14.88C24.84 14.6 24.512 14.38 24.15 14.23C23.78 14.08 23.394 14 23 14C22.2 14 21.44 14.32 20.88 14.88C20.32 15.44 20 16.2 20 17C20 17.8 20.32 18.56 20.88 19.12C21.44 19.68 22.2 20 23 20ZM32 31C32 31.27 31.89 31.52 31.71 31.71C31.52 31.89 31.27 32 31 32C30.73 32 30.48 31.89 30.29 31.71C30.11 31.52 30 31.27 30 31V29C30 28.2 29.68 27.44 29.12 26.88C28.56 26.32 27.8 26 27 26H19C18.2 26 17.44 26.32 16.88 26.88C16.32 27.44 16 28.2 16 29V31C16 31.27 15.89 31.52 15.71 31.71C15.52 31.89 15.27 32 15 32C14.73 32 14.48 31.89 14.29 31.71C14.11 31.52 14 31.27 14 31V29C14 27.67 14.53 26.4 15.46 25.46C16.4 24.53 17.67 24 19 24H27C28.33 24 29.6 24.53 30.54 25.46C31.47 26.4 32 27.67 32 29V31Z" fill={color}/>
    <Path d="M1 6C1 3.24 3.24 1 6 1H18C20.76 1 23 3.24 23 6C23 8.76 20.76 11 18 11H16.381C15.62 11 15 11.62 15 12.381V16.8L8.77 11.34L8.11 12.1L8.77 11.34C8.52 11.12 8.19 11 7.85 11H6C3.24 11 1 8.76 1 6Z" fill="white" stroke={color} strokeWidth="2"/>
    <Path d="M6 6L18 6" stroke="#C8BCC3" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export default SharingExperienceIcon;
