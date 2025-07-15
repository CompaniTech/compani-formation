import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import AttendanceSheets from '../../../../api/attendanceSheets';
import { RootStackParamList, RootCreateAttendanceSheetParamList } from '../../../../types/NavigationType';
import {
  INTER_B2B,
  DD_MM_YYYY,
  HH_MM,
  SINGLE,
  UPLOAD_METHOD,
  DATA_SELECTION,
  SLOTS_SELECTION,
  ATTENDANCE_SIGNATURE,
  ATTENDANCE_SUMMARY, END_SCREEN,
} from '../../../../core/data/constants';
import { errorReducer, initialErrorState, RESET_ERROR } from '../../../../reducers/error';
import AttendanceSheetSelectionForm from '../../../../components/AttendanceSheetSelectionForm';
import UploadMethods from '../../../../components/UploadMethods';
import {
  useGetCourse,
  useGetMissingAttendanceSheets,
  useGetGroupedSlotsToBeSigned,
} from '../../../../store/attendanceSheets/hooks';
import { useGetLoggedUserId } from '../../../../store/main/hooks';
import { DataOptionsType } from '../../../../store/attendanceSheets/slice';
import CompaniDate from '../../../../core/helpers/dates/companiDates';
import { formatPayload } from '../../../../core/helpers/pictures';
import RadioButtonList from '../../../../components/form/RadioButtonList';
import MultipleCheckboxList from '../../../../components/form/MultipleCheckboxList';
import AttendanceSignatureContainer from '../../../../components/AttendanceSignatureContainer';
import AttendanceSheetSummary from '../../../../components/AttendanceSheetSummary';
import AttendanceEndScreen from '../../../../components/AttendanceEndScreen';
import { generateSignatureFile } from '../helper';

interface CreateAttendanceSheetProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'CreateAttendanceSheet'>,
StackScreenProps<RootCreateAttendanceSheetParamList>
> {}

const CreateAttendanceSheet = ({ route, navigation }: CreateAttendanceSheetProps) => {
  const { isSingle } = route.params;
  const course = useGetCourse();
  const missingAttendanceSheets = useGetMissingAttendanceSheets();
  const groupedSlotsToBeSigned = useGetGroupedSlotsToBeSigned();
  const loggedUserId = useGetLoggedUserId();
  const [dataSelectionTitle, setDataSelectionTitle] = useState<string>('');
  const [slotSelectionTitle, setSlotSelectionTitle] = useState<string>('');
  const [attendanceSheetToAdd, setAttendanceSheetToAdd] = useState<string>('');
  const [slotsToAdd, setSlotsToAdd] = useState<string[]>([]);
  const [signature, setSignature] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [traineeName, setTraineeName] = useState<string>('');
  const [failUpload, setFailUpload] = useState<boolean>(false);
  const [selectedSlotsOptions, setSelectedSlotsOptions] = useState<DataOptionsType[][]>([]);
  const [errorData, dispatchErrorData] = useReducer(errorReducer, initialErrorState);
  const [errorSlots, dispatchErrorSlots] = useReducer(errorReducer, initialErrorState);
  const [errorSignature, dispatchErrorSignature] = useReducer(errorReducer, initialErrorState);
  const [errorConfirmation, dispatchErrorConfirmation] = useReducer(errorReducer, initialErrorState);
  const slotsOptions = useMemo(() =>
    Object.values(groupedSlotsToBeSigned)
      .map(slotGroup => [...slotGroup]
        .map(slot => ({
          label:
        `${CompaniDate(slot.startDate).format(`${DD_MM_YYYY} ${HH_MM}`)} - ${CompaniDate(slot.endDate).format(HH_MM)}`,
          value: slot._id,
        }))),
  [groupedSlotsToBeSigned]);

  useEffect(() => {
    setDataSelectionTitle(
      [INTER_B2B, SINGLE].includes(course?.type || '')
        ? 'Pour quel stagiaire souhaitez-vous charger une feuille d\'émargement ?'
        : 'Pour quelle date souhaitez-vous charger une feuille d\'émargement ?'
    );
  }, [course]);

  const setDataOption = useCallback((option: string) => {
    setAttendanceSheetToAdd(option);
    if ([INTER_B2B, SINGLE].includes(course?.type || '')) {
      const name = missingAttendanceSheets.find(as => as.value === option)?.label || '';
      setTraineeName(name);
      if (isSingle) {
        const title =
          'Pour quels créneaux souhaitez-vous charger une feuille d\'émargement ou envoyer une demande de signature'
          + ` à ${name} ?`;
        setSlotSelectionTitle(title);
      }
    }
    if (option) dispatchErrorData({ type: RESET_ERROR });
  }, [course, isSingle, missingAttendanceSheets]);

  useEffect(() => {
    if (course && isSingle) setDataOption(course.trainees![0]._id);
  });

  const setSlotsOptions = useCallback((options: string[]) => {
    setSlotsToAdd(options);
    if (options.length) dispatchErrorSlots({ type: RESET_ERROR });
  }, []);

  const setConfirmationCheckbox = () => {
    setConfirmation(prevState => !prevState);
    dispatchErrorConfirmation({ type: RESET_ERROR });
  };

  const saveAttendances = async () => {
    try {
      setIsLoading(true);
      const file = generateSignatureFile(signature, course?._id, 'trainer');
      const data = formatPayload({
        signature: file,
        course: course?._id,
        trainee: attendanceSheetToAdd,
        slots: slotsToAdd,
        trainer: loggedUserId,
      });
      await AttendanceSheets.upload(data);
      setIsLoading(false);
    } catch (e) {
      setFailUpload(true);
      console.error(e);
    }
  };

  const getFilteredStepsName = () => {
    const selectedSlotIds = selectedSlotsOptions.flatMap(slotGroup => slotGroup.map(s => s.value));

    return Object.entries(groupedSlotsToBeSigned)
      .filter(([_, slots]) => slots.some(slot => selectedSlotIds.includes(slot._id)))
      .map(([stepName, _]) => stepName);
  };

  const renderDataSelection = () => (
    <AttendanceSheetSelectionForm title={dataSelectionTitle} error={errorData} dispatchErrorData={dispatchErrorData}
      dispatchErrorSlots={dispatchErrorSlots} nextScreenName={isSingle ? SLOTS_SELECTION : UPLOAD_METHOD}
      courseType={course?.type || ''}
      attendanceSheetToAdd={attendanceSheetToAdd} areSlotsMissing={isSingle && !slotsToAdd.length}>
      <RadioButtonList options={missingAttendanceSheets} setOption={setDataOption}
        checkedRadioButton={attendanceSheetToAdd} />
    </AttendanceSheetSelectionForm>
  );

  const renderSlotSelection = () => (
    <AttendanceSheetSelectionForm title={slotSelectionTitle} error={errorSlots} dispatchErrorData={dispatchErrorData}
      dispatchErrorSlots={dispatchErrorSlots} nextScreenName={UPLOAD_METHOD} courseType={course?.type || ''}
      attendanceSheetToAdd={attendanceSheetToAdd} areSlotsMissing={isSingle && !slotsToAdd.length}>
      <MultipleCheckboxList optionsGroups={slotsOptions} groupTitles={Object.keys(groupedSlotsToBeSigned)}
        setOptions={setSlotsOptions} checkedList={slotsToAdd}/>
    </AttendanceSheetSelectionForm>
  );

  const renderUploadMethod = () => (
    <UploadMethods course={course!} goToParent={navigation.goBack}
      attendanceSheetToAdd={attendanceSheetToAdd} slotsToAdd={slotsToAdd} />
  );

  const renderSignatureContainer = () => (
    <AttendanceSignatureContainer signature={signature} error={errorSignature}
      setSignature={setSignature} setSelectedSlotsOptions={() => setSelectedSlotsOptions(
        slotsOptions.map(group => group.filter(opt => slotsToAdd.includes(opt.value))).filter(g => g.length)
      )} dispatchErrorSignature={dispatchErrorSignature}
      resetError={() => dispatchErrorSignature({ type: RESET_ERROR })} />
  );

  const renderSummary = () => (
    <AttendanceSheetSummary signature={signature} saveAttendances={saveAttendances}
      dispatchErrorConfirmation={dispatchErrorConfirmation} error={errorConfirmation}
      stepsName={getFilteredStepsName()} isLoading={isLoading} setConfirmation={setConfirmationCheckbox}
      confirmation={confirmation}
      traineeName={traineeName} slotsOptions={selectedSlotsOptions} />
  );
  const renderEndScreen = () => (
    <AttendanceEndScreen goToNextScreen={navigation.goBack} traineeName={traineeName}
      failUpload={failUpload} />
  );

  const Stack = createStackNavigator<RootCreateAttendanceSheetParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={DATA_SELECTION}>
      <Stack.Screen key={0} name={DATA_SELECTION}>{renderDataSelection}</Stack.Screen>
      {isSingle && <Stack.Screen key={1} name={SLOTS_SELECTION}>
        {renderSlotSelection}
      </Stack.Screen>}
      <Stack.Screen key={2} name={UPLOAD_METHOD}>{renderUploadMethod}</Stack.Screen>
      {isSingle && <>
        <Stack.Screen key={3} name={ATTENDANCE_SIGNATURE}>
          {renderSignatureContainer}
        </Stack.Screen>
        <Stack.Screen key={4} name={ATTENDANCE_SUMMARY}>{renderSummary}</Stack.Screen>
        <Stack.Screen options={{ gestureEnabled: false }} key={5} name={END_SCREEN}>
          {renderEndScreen}
        </Stack.Screen>
      </>}
    </Stack.Navigator>
  );
};

export default CreateAttendanceSheet;
