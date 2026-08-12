import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import CompaniDate from '../../core/helpers/dates/companiDates';
import { CourseModeType } from '../../types/CourseTypes';
import { capitalize } from '../../core/helpers/utils';
import { ICON } from '../../styles/metrics';
import { PINK, PURPLE, WHITE } from '../../styles/colors';
import Shadow from '../design/Shadow';
import ProgressPieChart from '../ProgressPieChart';
import { TRAINER, DAY_OF_WEEK_SHORT, DAY_OF_MONTH, MONTH_SHORT, DAY } from '../../core/data/constants';
import styles from './styles';

interface CalendarIconProps {
  slots: Date[],
  progress: number,
  mode: CourseModeType,
}

const CalendarIcon = ({ slots, progress = 0, mode }: CalendarIconProps) => {
  const TODAY = CompaniDate();
  const style = styles(mode === TRAINER ? PURPLE[800] : PINK[500]);

  const getNextSlot = useCallback(() => {
    if (TODAY.isBefore(slots[0])) return slots[0];
    if (TODAY.isAfter(slots[slots.length - 1])) return null;
    return slots.find(slot => TODAY.isBefore(slot));
  }, [slots, TODAY]);

  const hasSeveralDates = !!slots.length && slots.some(date => !CompaniDate(date).isSame(slots[0], DAY));
  const nextSlot = slots.length ? getNextSlot() : null;
  const date = slots.length ? (nextSlot ? CompaniDate(nextSlot) : CompaniDate(slots[0])) : null;
  const dayOfWeek = date ? capitalize(date.format(DAY_OF_WEEK_SHORT)) : '';
  const dayOfMonth = date ? capitalize(date.format(DAY_OF_MONTH)) : '';
  const month = date ? capitalize(date.format(MONTH_SHORT)) : '';

  const renderProgress = () => {
    if (!progress && !hasSeveralDates) return null;

    if (!progress) {
      return (
        <View style={style.datesLengthContainer}>
          <Ionicons name='calendar-sharp' size={ICON.SM} color={mode === TRAINER ? PURPLE[800] : PINK[500]}
            style={{ backgroundColor: WHITE }} />
        </View>
      );
    }

    return (
      <View style={progress < 1 ? style.progressContainer : style.finishedContainer}>
        <ProgressPieChart progress={progress} />
      </View>
    );
  };

  return (
    <View style={style.container}>
      <View style={style.dateContainer}>
        {dayOfWeek
          ? <>
            <Text style={style.dayOfWeek}>{dayOfWeek}</Text>
            <Text style={style.dayOfMonth}>{dayOfMonth}</Text>
            <Text style={style.month}>{month}</Text>
          </>
          : <>
            <View style={style.dayOfWeek} />
            <Text style={style.toPlan}>?</Text>
          </> }
      </View>
      {hasSeveralDates
        ? <>
          <Shadow customStyle={style.shadowHeader} relativePosition={{ top: 3, left: 3, right: -3, bottom: 0 }}/>
          <Shadow customStyle={style.manyDatesShadow} relativePosition={{ top: 3, left: 3, right: -3, bottom: -3 }} />
        </>
        : <Shadow customStyle={style.shadow} />}
      {renderProgress()}
    </View>
  );
};

export default CalendarIcon;
