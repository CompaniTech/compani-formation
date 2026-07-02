import Svg, { Path } from 'react-native-svg';

type blobProps = {
  color: string,
  style?: object,
  size?: number,
}

const Blob = ({ color, style, size = 250 }: blobProps) => (
  <Svg width={size} height={size} viewBox="0 0 232 249" fill="none"
    style={style}>
    <Path
      // eslint-disable-next-line max-len
      d="M231.5 108.802C231.5 183.636 163.835 248.802 89 248.802C14.17 248.802 -42.5 207.636 -42.5 132.802C-42.5 57.97 -28.33 0.3 46.5 0.3C121.335 0.3 231.5 33.97 231.5 108.802Z"
      fill={color}
    />
  </Svg>
);

export default Blob;
