import { Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import groupBy from 'lodash/groupBy';
import { useNavigation } from '@react-navigation/native';
import CompaniDate from '../../../core/helpers/dates/companiDates';
import { formatIdentity } from '../../../core/helpers/utils';
import { AttendanceSheetType, SignaturesType } from '../../../types/AttendanceSheetTypes';
import Shadow from '../../design/Shadow';
import { DD_MM_YYYY, INTER_B2B, LONG_FIRSTNAME_LONG_LASTNAME, SINGLE } from '../../../core/data/constants';
import { ICON } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import styles from './styles';
import { useGetLoggedUserId } from '../../../store/main/hooks';
import { useGetCourse, useSetGroupedSlotsToBeSigned } from '../../../store/attendanceSheets/hooks';
import { SlotType } from '../../../types/CourseTypes';

interface AttendanceSheetCellProps {
  attendanceSheet: AttendanceSheetType,
}

const AttendanceSheetCell = ({ attendanceSheet }: AttendanceSheetCellProps) => {
  const navigation = useNavigation();
  const loggedUserId = useGetLoggedUserId();
  const course = useGetCourse();
  const setGroupedSlotsToBeSigned = useSetGroupedSlotsToBeSigned();
  const [unsignedSlots, setUnsignedSlots] = useState<(SlotType & SignaturesType)[]>([]);

  useEffect(() => {
    setUnsignedSlots(
      (attendanceSheet.slots || [])
        .filter((s) => {
          const traineeSignatureMissing = [SINGLE, INTER_B2B].includes(course!.type)
            ? !(s.traineesSignature || [])
              .find(signature => signature?.traineeId === loggedUserId && !!signature.signature)
            : (s.traineesSignature || [])
              .find(signature => signature?.traineeId === loggedUserId && !signature.signature);
          return traineeSignatureMissing;
        })
    );
  }, [attendanceSheet.slots, course, loggedUserId]);

  const goToSignature = () => {
    const groupedSlots = groupBy(unsignedSlots, slot => slot.step);
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
          ...new Set(unsignedSlots!.map(slot => CompaniDate(slot.startDate).format(DD_MM_YYYY))),
        ].join(', ')
        }
      </Text>
    </View>
  );
};

export default AttendanceSheetCell;
