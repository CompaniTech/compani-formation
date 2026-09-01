import { View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import ProgressCircle from './ProgressCircle';
import styles from './styles';
import { ICON } from '../../styles/metrics';
import { PINK, WHITE } from '../../styles/colors';

interface ProgressPieChartProps {
  progress: number | null,
}

const ProgressPieChart = ({ progress }: ProgressPieChartProps) => (
  <View style={styles.container}>
    {!progress &&
        <View style={styles.unstartedContainer}>
          <Feather name='play-circle' size={ICON.MD} color={PINK[500]} />
        </View>}
    {!!progress && progress < 1 &&
        <View style={styles.progressContainer}>
          <ProgressCircle progress={progress} strokeWidth={4} size={16} />
        </View>}
    {progress === 1 &&
        <View style={styles.finishedContainer}>
          <Feather name='check' size={ICON.XS} color={WHITE} />
        </View>}
  </View>
);

export default ProgressPieChart;
