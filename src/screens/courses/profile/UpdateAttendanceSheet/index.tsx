import { useEffect, useMemo, useReducer, useState } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import AttendanceSheets from '../../../../api/attendanceSheets';
import { RootStackParamList, RootUpdateAttendanceSheetParamList } from '../../../../types/NavigationType';
import {
  ATTENDANCE_SIGNATURE,
  ATTENDANCE_SUMMARY,
  DD_MM_YYYY,
  END_SCREEN,
  HH_MM,
  LEARNER,
  LONG_FIRSTNAME_LONG_LASTNAME,
  SLOTS_SELECTION,
} from '../../../../core/data/constants';
import { errorReducer, initialErrorState, RESET_ERROR } from '../../../../reducers/error';
import AttendanceSheetSelectionForm from '../../../../components/AttendanceSheetSelectionForm';
import { useGetCourse, useGetGroupedSlotsToBeSigned } from '../../../../store/attendanceSheets/hooks';
import CompaniDate from '../../../../core/helpers/dates/companiDates';
import { ascendingSort } from '../../../../core/helpers/dates/utils';
import { formatPayload } from '../../../../core/helpers/pictures';
import MultipleCheckboxList from '../../../../components/form/MultipleCheckboxList';
import AttendanceSignatureContainer from '../../../../components/AttendanceSignatureContainer';
import AttendanceSheetSummary from '../../../../components/AttendanceSheetSummary';
import AttendanceEndScreen from '../../../../components/AttendanceEndScreen';
import { useGetLoggedUser } from '../../../../store/main/hooks';
import { formatIdentity } from '../../../../core/helpers/utils';
import { tabsNames } from '../../../../core/data/tabs';
import { generateSignatureFile } from '../helper';

interface UpdateAttendanceSheetProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'UpdateAttendanceSheet'>,
StackScreenProps<RootUpdateAttendanceSheetParamList>
> {}

const UpdateAttendanceSheet = ({ route, navigation }: UpdateAttendanceSheetProps) => {
  const { attendanceSheetId, trainerName } = route.params;
  const course = useGetCourse();
  const loggedUser = useGetLoggedUser();
  const groupedSlotsToBeSigned = useGetGroupedSlotsToBeSigned();
  const [slotSelectionTitle, setSlotSelectionTitle] = useState<string>('');
  const slotList = Object.values(groupedSlotsToBeSigned).map(group => group.map(s => s._id)).flat();
  const [signature, setSignature] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [traineeName, setTraineeName] = useState<string>('');
  const [failUpload, setFailUpload] = useState<boolean>(false);
  const [errorSignature, dispatchErrorSignature] = useReducer(errorReducer, initialErrorState);
  const [errorConfirmation, dispatchErrorConfirmation] = useReducer(errorReducer, initialErrorState);
  const stepsName = useMemo(() =>
    Object.keys(groupedSlotsToBeSigned), [groupedSlotsToBeSigned]);
  const slotsOptions = useMemo(() =>
    Object.values(groupedSlotsToBeSigned)
      .map(slotGroup => [...slotGroup]
        .sort(ascendingSort('startDate'))
        .map(slot => ({
          label:
        `${CompaniDate(slot.startDate).format(`${DD_MM_YYYY} ${HH_MM}`)} - ${CompaniDate(slot.endDate).format(HH_MM)}`,
          value: slot._id,
        }))),
  [groupedSlotsToBeSigned]);

  useEffect(() => {
    if (loggedUser?.identity) setTraineeName(formatIdentity(loggedUser.identity, LONG_FIRSTNAME_LONG_LASTNAME));
  }, [loggedUser]);

  useEffect(() => {
    setSlotSelectionTitle(`${trainerName} vous demande d'émarger les créneaux suivants : `);
  }, [trainerName]);

  const setConfirmationCheckbox = () => {
    setConfirmation(prevState => !prevState);
    dispatchErrorConfirmation({ type: RESET_ERROR });
  };

  const saveAttendances = async () => {
    try {
      setIsLoading(true);
      const file = generateSignatureFile(signature, course?._id, 'trainee');
      const data = formatPayload({ signature: file });
      await AttendanceSheets.sign(attendanceSheetId, data);
      setIsLoading(false);
    } catch (e) {
      setFailUpload(true);
      console.error(e);
    }
  };

  const renderSlotSelection = () => (
    <AttendanceSheetSelectionForm title={slotSelectionTitle} error={initialErrorState}
      nextScreenName={ATTENDANCE_SIGNATURE}>
      <MultipleCheckboxList optionsGroups={slotsOptions} groupTitles={stepsName} checkedList={slotList} disabled />
    </AttendanceSheetSelectionForm>
  );

  const renderSignatureContainer = () => (
    <AttendanceSignatureContainer signature={signature} resetError={() => dispatchErrorSignature({ type: RESET_ERROR })}
      dispatchErrorSignature={dispatchErrorSignature} error={errorSignature} setSignature={setSignature} />
  );

  const renderSummary = () => (
    <AttendanceSheetSummary signature={signature} saveAttendances={saveAttendances} error={errorConfirmation}
      dispatchErrorConfirmation={dispatchErrorConfirmation}
      stepsName={stepsName} isLoading={isLoading} setConfirmation={setConfirmationCheckbox} confirmation={confirmation}
      traineeName={traineeName} slotsOptions={slotsOptions} />
  );

  const goBackToCourseAndRefresh = () => {
    if (course) navigation.popTo('LearnerCourseProfile', { courseId: course!._id, endedActivity: true, mode: LEARNER });
    else navigation.goBack();
  };

  const renderEndScreen = () => (
    <AttendanceEndScreen goToNextScreen={goBackToCourseAndRefresh} traineeName={traineeName} failUpload={failUpload}
      mode={LEARNER} />
  );

  const Stack = createStackNavigator<RootUpdateAttendanceSheetParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }} initialRouteName={SLOTS_SELECTION}>
      <Stack.Screen key={1} name={SLOTS_SELECTION} options={{ title: tabsNames.UpdateAttendanceSheet }}>
        {renderSlotSelection}
      </Stack.Screen>
      <Stack.Screen key={2} name={ATTENDANCE_SIGNATURE} options={{ title: tabsNames.UpdateAttendanceSheet }}>
        {renderSignatureContainer}
      </Stack.Screen>
      <Stack.Screen key={3} name={ATTENDANCE_SUMMARY} options={{ title: tabsNames.UpdateAttendanceSheet }}>
        {renderSummary}
      </Stack.Screen>
      <Stack.Screen options={{ gestureEnabled: false, title: tabsNames.UpdateAttendanceSheet }} key={4}
        name={END_SCREEN}>
        {renderEndScreen}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default UpdateAttendanceSheet;
