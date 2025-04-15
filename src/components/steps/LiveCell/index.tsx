import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import get from 'lodash/get';
import { CourseModeType } from '../../../types/CourseTypes';
import { LiveStepType } from '../../../types/StepTypes';
import CalendarIcon from '../../CalendarIcon';
import { ICON } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import StepCellTitle from '../StepCellTitle';
import LiveCellInfoModal from '../LiveCellInfoModal';
import styles from './styles';

type LiveCellProps = {
  step: LiveStepType,
  index: number,
  mode: CourseModeType,
}

const LiveCell = React.memo(({ step, index, mode }: LiveCellProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    setModalTitle(`Etape ${index + 1} - ${step.name}`);
    setDates(step.slots.map(slot => slot.endDate));
  }, [step, index]);

  const closeModal = () => setIsModalVisible(false);
  const openModal = () => { if (step.slots.length) setIsModalVisible(true); };

  return (
    <>
      {isModalVisible && (<LiveCellInfoModal title={modalTitle} stepSlots={step.slots} visible={isModalVisible}
        onRequestClose={closeModal} />)}
      <TouchableOpacity style={[styles.container, styles.upperContainer]} onPress={openModal}>
        <CalendarIcon slots={dates} progress={get(step, 'progress.live')} mode={mode} />
        <StepCellTitle index={index} name={step.name} type={step.type} mode={mode} />
        <View style={styles.iconContainer}>
          <Feather name='info' size={ICON.LG} color={GREY[500]} style={styles.infoButtonContainer} />
        </View>
      </TouchableOpacity>
    </>
  );
});

export default LiveCell;
