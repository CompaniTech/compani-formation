/* eslint-disable max-len */
import Svg, { Path, Circle } from 'react-native-svg';
import { ICON } from '../../src/styles/metrics';

type CatalogSelectedIconProps = {
  style?: object,
  size?: number,
}

const CatalogSelectedIcon = ({ style, size = ICON.MD }: CatalogSelectedIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="10" cy="10" r="6" fill="#FFEBF1"/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M4.04 10.67C5.5 9.03 7.63 8 10 8C12.37 8 14.5 9.03 15.96 10.67C15.63 13.67 13.09 16 10 16C6.91 16 4.37 13.67 4.04 10.67Z" fill="#FBB8D2"/>
    <Path d="M16.32 14.9L21.71 20.3C21.87 20.49 21.96 20.74 21.945 20.99C21.93 21.24 21.83 21.48 21.65 21.66C21.47 21.83 21.23 21.94 20.98 21.94C20.73 21.95 20.48 21.87 20.29 21.7L14.91 16.32C13.3 17.57 11.28 18.16 9.25 17.97C7.23 17.78 5.35 16.82 4 15.29C2.66 13.77 1.94 11.79 2.01 9.75C2.07 7.72 2.91 5.78 4.35 4.35C5.78 2.91 7.72 2.07 9.75 2.01C11.79 1.94 13.77 2.66 15.29 4C16.821 5.35 17.78 7.23 17.97 9.25C18.16 11.28 17.57 13.3 16.32 14.91V14.9ZM10 16C11.59 16 13.12 15.37 14.24 14.24C15.37 13.12 16 11.59 16 10C16 8.41 15.37 6.88 14.24 5.76C13.12 4.63 11.59 4 10 4C8.41 4 6.88 4.63 5.76 5.76C4.63 6.88 4 8.41 4 10C4 11.59 4.63 13.12 5.76 14.24C6.88 15.37 8.41 16 10 16Z" fill="#C12862"/>
  </Svg>
);

export default CatalogSelectedIcon;
