import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CompaniDate from '../../core/helpers/dates/companiDates';
import { CourseModeType } from '../../types/CourseTypes';
import { capitalize } from '../../core/helpers/utils';
import { ICON } from '../../styles/metrics';
import { PINK, PURPLE, WHITE } from '../../styles/colors';
import Shadow from '../design/Shadow';
import ProgressPieChart from '../ProgressPieChart';
import { TRAINER, DAY_OF_WEEK_SHORT, DAY_OF_MONTH, MONTH_SHORT, TODAY, DAY } from '../../core/data/constants';
import styles from './styles';

interface CalendarIconProps {
  slots: Date[],
  progress: number,
  mode: CourseModeType,
}

const CalendarIcon = ({ slots, progress = 0, mode }: CalendarIconProps) => {
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [dayOfMonth, setDayOfMonth] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [hasSeveralDates, setHasSeveralDates] = useState<boolean>(false);
  const style = styles(mode === TRAINER ? PURPLE[800] : PINK[500]);

  const getNextSlot = useCallback(() => {
    if (TODAY.isBefore(slots[0])) return slots[0];
    if (TODAY.isAfter(slots[slots.length - 1])) return null;
    return slots.find(slot => TODAY.isBefore(slot));
  }, [slots]);

  useEffect(() => {
    if (slots.length) {
      setHasSeveralDates(!!slots.length && slots.some(date => !CompaniDate(date).isSame(slots[0], DAY)));
      const nextSlot = getNextSlot();
      const date = nextSlot ? CompaniDate(nextSlot) : CompaniDate(slots[0]);

      setDayOfWeek(capitalize(date.format(DAY_OF_WEEK_SHORT)));
      setDayOfMonth(capitalize(date.format(DAY_OF_MONTH)));
      setMonth(capitalize(date.format(MONTH_SHORT)));
    }
  }, [slots, getNextSlot]);

  const renderProgress = () => {
    if (!progress && !hasSeveralDates) return null;

    if (!progress) {
      return (
        <View style={style.datesLengthContainer}>
          <Ionicons name='calendar-sharp' size={ICON.SM} color={mode === TRAINER ? PURPLE[800] : PINK[500]}
            backgroundColor={WHITE} />
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
