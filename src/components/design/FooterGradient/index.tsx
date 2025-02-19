import { LinearGradient } from 'expo-linear-gradient';
import { GREY, TRANSPARENT_GRADIENT } from '../../../styles/colors';
import { ABSOLUTE_BOTTOM_POSITION, INPUT_HEIGHT } from '../../../styles/metrics';
import styles from './styles';

interface FooterGradientProps {
  colors?: readonly [string, string, ...string[]],
  bottomPosition?: number,
  height?: number,
}
const FooterGradient = ({
  colors = [TRANSPARENT_GRADIENT, GREY[100]],
  bottomPosition = ABSOLUTE_BOTTOM_POSITION,
  height = INPUT_HEIGHT,
}: FooterGradientProps) => (
  <LinearGradient style={styles(bottomPosition, height).gradient} colors={colors} />
);

export default FooterGradient;
