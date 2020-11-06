import React from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProgressCircle } from 'react-native-svg-charts';
import styles from './styles';
import { BORDER_RADIUS, ICON } from '../../styles/metrics';
import { PINK, WHITE, YELLOW } from '../../styles/colors';
import { StepType } from '../../types/StepType';

interface ProgressPieChartProps {
  step: StepType,
}

const ProgressPieChart = ({ step }: ProgressPieChartProps) => (
  <View style={styles.container}>
    {!step.progress &&
        <View style={styles.unstartedContainer}>
          <Feather name='play-circle' size={ICON.MD} color={PINK[500]} />
        </View>}
    {!!step.progress && step.progress < 1 &&
        <View style={styles.progressContainer}>
          <ProgressCircle style={styles.progress} progress={step.progress}
            progressColor={YELLOW[500]} backgroundColor='transparent' strokeWidth={4} cornerRadius={BORDER_RADIUS.LG}/>
        </View>}
    {step.progress === 1 &&
        <View style={styles.finishedContainer}>
          <Feather name='check' size={ICON.XS} color={WHITE} />
        </View>}
  </View>
);

export default ProgressPieChart;
