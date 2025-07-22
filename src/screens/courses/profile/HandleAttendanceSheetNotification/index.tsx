import { useEffect } from 'react';
import groupBy from 'lodash/groupBy';
import { StackScreenProps } from '@react-navigation/stack';
import { useSetGroupedSlotsToBeSigned } from '../../../../store/attendanceSheets/hooks';
import Courses from '../../../../api/courses';
import { RootStackParamList } from '../../../../types/NavigationType';
import { BlendedCourseType, SlotType } from '../../../../types/CourseTypes';
import { LONG_FIRSTNAME_LONG_LASTNAME } from '../../../../core/data/constants';
import { formatIdentity } from '../../../../core/helpers/utils';

interface HandleAttendanceSheetNotificationProps extends StackScreenProps<
RootStackParamList, 'HandleAttendanceSheetNotification'>{}

const HandleAttendanceSheetNotification = ({ route, navigation }: HandleAttendanceSheetNotificationProps) => {
  const { attendanceSheetId, courseId } = route.params;
  const setGroupedSlotsToBeSigned = useSetGroupedSlotsToBeSigned();

  useEffect(() => {
    const storeDataAndRedirect = async () => {
      try {
        const course = await Courses.getCourse(courseId, 'pedagogy') as BlendedCourseType;
        const attendanceSheet = course.attendanceSheets?.find(as => as._id === attendanceSheetId);
        const grouped = groupBy(attendanceSheet?.slots, slot => slot.slotId.step);
        const groupedSlots = Object.fromEntries(
          Object.entries(grouped).map(([step, slots]) => [step, slots.map(slot => slot.slotId)])
        );
        const groupedSlotsToBeSigned = course.subProgram.steps.reduce<Record<string, SlotType[]>>((acc, step) => {
          if (groupedSlots[step._id]) acc[step.name] = groupedSlots[step._id];
          return acc;
        }, {});

        setGroupedSlotsToBeSigned(groupedSlotsToBeSigned);

        const trainerName = formatIdentity(attendanceSheet!.trainer.identity, LONG_FIRSTNAME_LONG_LASTNAME);
        navigation.replace('UpdateAttendanceSheet', { attendanceSheetId, trainerName });
      } catch (error) {
        console.error(error);
      }
    };

    storeDataAndRedirect();
  }, [attendanceSheetId, courseId, navigation, setGroupedSlotsToBeSigned]);

  return null;
};

export default HandleAttendanceSheetNotification;
