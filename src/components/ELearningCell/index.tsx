import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ELearningStepType } from '../../types/StepTypes';
import { CourseModeType } from '../../types/CourseTypes';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import FeatherButton from '../icons/FeatherButton';
import StepCellTitle from '../steps/StepCellTitle';
import ActivityList from '../activities/ActivityList';
import ProgressPieChart from '../ProgressPieChart';
import styles from './styles';

type ELearningCellProps = {
  step: ELearningStepType,
  index: number,
  profileId: string,
  mode: CourseModeType,
  endedActivity?: string,
}

const ELearningCell = React.memo(({ step, index, profileId, mode, endedActivity = '' }: ELearningCellProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onPressChevron = () => { setIsOpen(prevState => !prevState); };
  const iconButtonStyle =  { ...styles.iconButtonContainer, ...isOpen && {...styles.openedIconButtonContainer} };

  useEffect(() => {
    if (step && step.activities && endedActivity) {
      setIsOpen(step.activities.map(activity => activity._id).includes(endedActivity));
    }
  }, [endedActivity, step]);

  return (
    <View style={[styles.container, isOpen && styles.openedContainer]}>
      <TouchableOpacity activeOpacity={1} onPress={onPressChevron} style={styles.textContainer}>
        <View style={styles.topContainer}>
          <ProgressPieChart progress={step.progress?.eLearning} />
          <StepCellTitle index={index} name={step.name} type={step.type} theoreticalDuration={step.theoreticalDuration}
            mode={mode} />
          <FeatherButton name={isOpen ? 'chevron-up' : 'chevron-down' } onPress={onPressChevron} size={ICON.MD}
            color={GREY[500]} style={iconButtonStyle} />
        </View>
      </TouchableOpacity>
      {isOpen && <ActivityList activities={step.activities} profileId={profileId} mode={mode} />}
    </View>
  );
});

export default ELearningCell;
