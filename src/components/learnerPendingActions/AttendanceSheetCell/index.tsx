import { Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import groupBy from 'lodash/groupBy';
import { useNavigation } from '@react-navigation/native';
import CompaniDate from '../../../core/helpers/dates/companiDates';
import { formatIdentity } from '../../../core/helpers/utils';
import { AttendanceSheetType } from '../../../types/AttendanceSheetTypes';
import Shadow from '../../design/Shadow';
import { DD_MM_YYYY, LONG_FIRSTNAME_LONG_LASTNAME } from '../../../core/data/constants';
import { ICON } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import styles from './styles';
import { useGetCourse, useSetGroupedSlotsToBeSigned } from '../../../store/attendanceSheets/hooks';
import { SlotType } from '../../../types/CourseTypes';

interface AttendanceSheetCellProps {
  attendanceSheet: AttendanceSheetType,
}

const AttendanceSheetCell = ({ attendanceSheet }: AttendanceSheetCellProps) => {
  const navigation = useNavigation();
  const course = useGetCourse();
  const setGroupedSlotsToBeSigned = useSetGroupedSlotsToBeSigned();

  const goToSignature = () => {
    const grouped = groupBy(attendanceSheet.slots, slot => slot.slotId.step);
    const groupedSlots = Object.fromEntries(
      Object.entries(grouped).map(([step, slots]) => [step, slots.map(slot => slot.slotId)])
    );
    const groupedSlotsToBeSigned = course?.subProgram.steps.reduce<Record<string, SlotType[]>>((acc, step) => {
      if (groupedSlots[step._id]) acc[step.name] = groupedSlots[step._id];
      return acc;
    }, {});

    setGroupedSlotsToBeSigned(groupedSlotsToBeSigned!);
    const trainerName = formatIdentity(attendanceSheet.trainer.identity, LONG_FIRSTNAME_LONG_LASTNAME);
    navigation.navigate('UpdateAttendanceSheet', { attendanceSheetId: attendanceSheet._id, trainerName });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={goToSignature}>
        <View style={styles.icon}>
          <Feather name='pen-tool' size={ICON.LG} color={GREY[700]} />
        </View>
        <Shadow customStyle={styles.shadow} />
      </TouchableOpacity>
      <Text style={styles.AttendanceSheetName} lineBreakMode={'tail'} numberOfLines={2}>
      À signer {[
          ...new Set(attendanceSheet.slots!.map(slot => CompaniDate(slot.slotId.startDate).format(DD_MM_YYYY))),
        ].join(', ')
        }
      </Text>
    </View>
  );
};

export default AttendanceSheetCell;
