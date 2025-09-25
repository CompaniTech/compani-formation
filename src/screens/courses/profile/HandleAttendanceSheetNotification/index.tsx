import { useEffect } from 'react';
import groupBy from 'lodash/groupBy';
import { StackScreenProps } from '@react-navigation/stack';
import { useSetGroupedSlotsToBeSigned } from '../../../../store/attendanceSheets/hooks';
import Courses from '../../../../api/courses';
import { RootStackParamList } from '../../../../types/NavigationType';
import { BlendedCourseType, SlotType } from '../../../../types/CourseTypes';
import { INTER_B2B, LONG_FIRSTNAME_LONG_LASTNAME, SINGLE } from '../../../../core/data/constants';
import { formatIdentity } from '../../../../core/helpers/utils';
import { useGetLoggedUserId } from '../../../../store/main/hooks';

interface HandleAttendanceSheetNotificationProps extends StackScreenProps<
RootStackParamList, 'HandleAttendanceSheetNotification'>{}

const HandleAttendanceSheetNotification = ({ route, navigation }: HandleAttendanceSheetNotificationProps) => {
  const { attendanceSheetId, courseId } = route.params;
  const setGroupedSlotsToBeSigned = useSetGroupedSlotsToBeSigned();
  const loggedUserId = useGetLoggedUserId();

  useEffect(() => {
    const storeDataAndRedirect = async () => {
      try {
        const course = await Courses.getCourse(courseId, 'pedagogy') as BlendedCourseType;
        const attendanceSheet = course.attendanceSheets?.find(as => as._id === attendanceSheetId);
        const unsignedSlots = (attendanceSheet!.slots || [])
          .filter((s) => {
            const traineeSignatureMissing = [SINGLE, INTER_B2B].includes(course!.type)
              ? !(s.traineesSignature || [])
                .find(signature => signature?.traineeId === loggedUserId && !!signature.signature)
              : (s.traineesSignature || [])
                .find(signature => signature?.traineeId === loggedUserId && !signature.signature);
            return traineeSignatureMissing;
          });
        const groupedSlots = groupBy(unsignedSlots, slot => slot.step);
        const groupedSlotsToBeSigned = course.subProgram.steps.reduce<Record<string, SlotType[]>>((acc, step) => {
          if (groupedSlots[step._id]) acc[step.name] = groupedSlots[step._id];
          return acc;
        }, {});
        if (!Object.values(groupedSlotsToBeSigned).flat().length) {
          navigation.goBack();
          return;
        }
        setGroupedSlotsToBeSigned(groupedSlotsToBeSigned);

        const trainerName = formatIdentity(attendanceSheet!.trainer.identity, LONG_FIRSTNAME_LONG_LASTNAME);
        navigation.replace('UpdateAttendanceSheet', { attendanceSheetId, trainerName });
      } catch (error) {
        console.error(error);
      }
    };

    storeDataAndRedirect();
  }, [attendanceSheetId, courseId, loggedUserId, navigation, setGroupedSlotsToBeSigned]);

  return null;
};

export default HandleAttendanceSheetNotification;
