import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import AttendanceSheets from '../../../../api/attendanceSheets';
import { RootStackParamList, RootCreateAttendanceSheetParamList } from '../../../../types/NavigationType';
import { INTER_B2B, DD_MM_YYYY, HH_MM, SINGLE } from '../../../../core/data/constants';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../../../reducers/error';
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

const DATA_SELECTION = 'attendance-sheet-data-selection';
const SLOTS_SELECTION = 'slots-data-selection';
const UPLOAD_METHOD = 'upload-method-selection';
const ATTENDANCE_SIGNATURE = 'attendance-signature';
const ATTENDANCE_SUMMARY = 'attendance-summary';
const END_SCREEN = 'end-screen';

const CreateAttendanceSheet = ({ route }: CreateAttendanceSheetProps) => {
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

  const goToUploadMethod = (navigation: any) => {
    if (isSingle && !slotsToAdd.length) {
      dispatchErrorSlots({ type: SET_ERROR, payload: 'Veuillez sélectionner des créneaux' });
    } else if (!attendanceSheetToAdd) {
      dispatchErrorData({
        type: SET_ERROR,
        payload: [INTER_B2B, SINGLE].includes(course?.type || '')
          ? 'Veuillez sélectionner un stagiaire'
          : 'Veuillez sélectionner une date',
      });
    } else {
      dispatchErrorData({ type: RESET_ERROR });
      navigation.navigate(UPLOAD_METHOD);
    }
  };

  const goToSlotSelection = (navigation: any) => {
    if (!attendanceSheetToAdd) {
      dispatchErrorData({ type: SET_ERROR, payload: 'Veuillez sélectionner un stagiaire' });
    } else {
      dispatchErrorData({ type: RESET_ERROR });
      navigation.navigate(SLOTS_SELECTION);
    }
  };

  const goToSummary = (navigation: any) => {
    if (!signature) {
      dispatchErrorSignature({ type: SET_ERROR, payload: 'Veuillez signer dans l\'encadré' });
    } else {
      dispatchErrorSignature({ type: RESET_ERROR });
      setSelectedSlotsOptions(
        slotsOptions.map(group => group.filter(opt => slotsToAdd.includes(opt.value))).filter(g => g.length)
      );
      navigation.navigate(ATTENDANCE_SUMMARY);
    }
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

  const saveAndGoToEndScreen = async (navigation: any) => {
    if (!confirmation) {
      dispatchErrorConfirmation({ type: SET_ERROR, payload: 'Veuillez cocher la case ci-dessous' });
    } else {
      dispatchErrorConfirmation({ type: RESET_ERROR });
      await saveAttendances();
      navigation.navigate(END_SCREEN);
    }
  };

  const renderDataSelection = (navigation: any) => (
    <AttendanceSheetSelectionForm title={dataSelectionTitle} error={errorData}
      goToNextScreen={isSingle ? () => goToSlotSelection(navigation) : () => goToUploadMethod(navigation)}>
      <RadioButtonList options={missingAttendanceSheets} setOption={setDataOption}
        checkedRadioButton={attendanceSheetToAdd} />
    </AttendanceSheetSelectionForm>
  );

  const renderSlotSelection = (navigation: any) => (
    <AttendanceSheetSelectionForm title={slotSelectionTitle} error={errorSlots}
      goToNextScreen={() => goToUploadMethod(navigation)}>
      <MultipleCheckboxList optionsGroups={slotsOptions} groupTitles={Object.keys(groupedSlotsToBeSigned)}
        setOptions={setSlotsOptions} checkedList={slotsToAdd}/>
    </AttendanceSheetSelectionForm>
  );

  const renderUploadMethod = (navigation: any) => (
    <UploadMethods course={course!} goToParent={() => navigation.getParent()?.goBack()}
      attendanceSheetToAdd={attendanceSheetToAdd} slotsToAdd={slotsToAdd} />
  );

  const renderSignatureContainer = (navigation: any) => (
    <AttendanceSignatureContainer error={errorSignature} goToNextScreen={() => goToSummary(navigation)}
      setSignature={setSignature}
      resetError={() => dispatchErrorSignature({ type: RESET_ERROR })} />
  );

  const renderSummary = (navigation: any) => (
    <AttendanceSheetSummary signature={signature} goToNextScreen={() => saveAndGoToEndScreen(navigation)}
      error={errorConfirmation}
      stepsName={getFilteredStepsName()} isLoading={isLoading} setConfirmation={setConfirmationCheckbox}
      confirmation={confirmation}
      traineeName={traineeName} slotsOptions={selectedSlotsOptions} />
  );
  const renderEndScreen = (navigation: any) => (
    <AttendanceEndScreen goToNextScreen={() => navigation.getParent()?.goBack()} traineeName={traineeName}
      failUpload={failUpload} />
  );

  const Stack = createStackNavigator<RootCreateAttendanceSheetParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={DATA_SELECTION}>
      <Stack.Screen key={0} name={DATA_SELECTION}>{({ navigation }) => renderDataSelection(navigation)}</Stack.Screen>
      {isSingle && <Stack.Screen key={1} name={SLOTS_SELECTION}>
        {({ navigation }) => renderSlotSelection(navigation)}
      </Stack.Screen>}
      <Stack.Screen key={2} name={UPLOAD_METHOD}>{({ navigation }) => renderUploadMethod(navigation)}</Stack.Screen>
      {isSingle && <>
        <Stack.Screen key={3} name={ATTENDANCE_SIGNATURE}>
          {({ navigation }) => renderSignatureContainer(navigation)}
        </Stack.Screen>
        <Stack.Screen key={4} name={ATTENDANCE_SUMMARY}>{({ navigation }) => renderSummary(navigation)}</Stack.Screen>
        <Stack.Screen options={{ gestureEnabled: false }} key={5} name={END_SCREEN}>
          {({ navigation }) => renderEndScreen(navigation)}
        </Stack.Screen>
      </>}
    </Stack.Navigator>
  );
};

export default CreateAttendanceSheet;
