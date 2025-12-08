import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import AttendanceSheets from '../../../../api/attendanceSheets';
import { RootStackParamList, RootCreateAttendanceSheetParamList } from '../../../../types/NavigationType';
import { SlotType } from '../../../../types/CourseTypes';
import {
  INTER_B2B,
  DD_MM_YYYY,
  HH_MM,
  SINGLE,
  UPLOAD_METHOD,
  DATA_SELECTION,
  SLOTS_SELECTION,
  ATTENDANCE_SIGNATURE,
  TRAINEES_ATTENDANCES,
  ATTENDANCE_SUMMARY, END_SCREEN,
  DAY,
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
import { formatIdentity } from '../../../../core/helpers/utils';
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
  const [traineesAttendanceTitles, setTraineesAttendanceTitles] = useState<string[]>([]);
  const [attendanceSheetToAdd, setAttendanceSheetToAdd] = useState<string[]>([]);
  const [slotsToAdd, setSlotsToAdd] = useState<string[]>([]);
  const [traineesBySlotToAdd, setTraineesBySlotToAdd] = useState<Record<string, string[]>>({});
  const [signature, setSignature] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');
  const [failUpload, setFailUpload] = useState<boolean>(false);
  const [selectedSlotsOptions, setSelectedSlotsOptions] = useState<DataOptionsType[][]>([]);
  const [traineesOptions, setTraineesOptions] = useState<DataOptionsType[][]>([]);
  const [dateSlots, setDateSlots] = useState<SlotType[]>([]);
  const [selectedTraineesOptions, setSelectedTraineesOptions] = useState<DataOptionsType[][]>([]);
  const [errorData, dispatchErrorData] = useReducer(errorReducer, initialErrorState);
  const [errorSlots, dispatchErrorSlots] = useReducer(errorReducer, initialErrorState);
  const [errorTrainees, dispatchErrorTrainees] = useReducer(errorReducer, initialErrorState);
  const [errorSignature, dispatchErrorSignature] = useReducer(errorReducer, initialErrorState);
  const [errorConfirmation, dispatchErrorConfirmation] = useReducer(errorReducer, initialErrorState);
  const slotsOptions = useMemo(() =>
    Object.values(groupedSlotsToBeSigned)
      .map(slotGroup => [...slotGroup]
        .map(slot => ({
          label:
        `${CompaniDate(slot.startDate).format(`${DD_MM_YYYY} ${HH_MM}`)} - ${CompaniDate(slot.endDate).format(HH_MM)}`,
          value: slot._id,
          ...slot.trainees && { trainees: slot.trainees },
          ...slot.missingAttendances && { missingAttendances: slot.missingAttendances },
        }))),
  [groupedSlotsToBeSigned]);

  useEffect(() => {
    let title = 'Pour quelle date souhaitez-vous charger une feuille d\'émargement ?';
    if (isSingle) {
      title = 'Pour quel stagiaire souhaitez-vous charger une feuille d\'émargement ?';
    }
    if (course?.type === INTER_B2B) {
      title = 'Pour quels stagiaires souhaitez-vous charger une feuille d\'émargement ?';
    }
    setDataSelectionTitle(title);
  }, [course, isSingle]);

  const setDataOption = useCallback((options: string[]) => {
    if (course?.type !== SINGLE || options.length) {
      setAttendanceSheetToAdd(options);
      const name = missingAttendanceSheets
        .filter(as => options.includes(as.value)).map(item => item.label || '').join(', ');
      setTarget(name);
      const title =
            'Pour quels créneaux souhaitez-vous charger une feuille d\'émargement ou envoyer une demande de signature'
            + ` à ${name} ?`;
      setSlotSelectionTitle(title);
      dispatchErrorData({ type: RESET_ERROR });
    }
  }, [course, missingAttendanceSheets]);

  const setTraineesAttendanceOptions = () => {
    const slots = Object.values(groupedSlotsToBeSigned).flat()
      .filter(s => CompaniDate(s.startDate).isSame(attendanceSheetToAdd[0], DAY));
    setDateSlots(slots);
    const trainees = course!.trainees?.map(t => ({ label: formatIdentity(t.identity, 'FL'), value: t._id })) || [];
    const traineesBySlot = slots
      .map(s => trainees.map((t) => {
        const traineeIsMissing = s.missingAttendances?.find(a => a.trainee === t.value);
        const traineeIsConcerned = !s.trainees || s.trainees.includes(t.value);
        if (traineeIsMissing || !traineeIsConcerned) return { ...t, disabled: true };
        return { ...t, disabled: false };
      }));
    setTraineesOptions(traineesBySlot);
    const titles = slots.map(s =>
      `${CompaniDate(s.startDate).format(`${DD_MM_YYYY} ${HH_MM}`)} - ${CompaniDate(s.endDate).format(HH_MM)}`);
    setTraineesAttendanceTitles(titles);
    setTraineesBySlotToAdd(
      Object.fromEntries(
        slots.map((slot, i) => [slot._id, traineesBySlot[i].filter(t => !t.disabled).map(t => t.value)])
      )
    );
  };

  const setTraineesBySlotOptions = (options: string[][]) => {
    setTraineesBySlotToAdd(
      Object.fromEntries(Object.entries(traineesBySlotToAdd).map(([slot, _], index) => [slot, options[index]]))
    );
    if (options.flat().length) dispatchErrorTrainees({ type: RESET_ERROR });
  };

  useEffect(() => {
    if (course && isSingle) setDataOption(course.trainees!.map(t => t._id));
  }, [course, isSingle, setDataOption]);

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
      let data;
      if (isSingle || course?.type === INTER_B2B) {
        data = formatPayload({
          signature: file,
          course: course?._id,
          trainees: attendanceSheetToAdd,
          slots: slotsToAdd,
          trainer: loggedUserId,
        });
      } else {
        const slots = dateSlots
          .map(s => ({ slotId: s._id, trainees: traineesBySlotToAdd[s._id] }))
          .filter(s => s.trainees.length)
          .map(s => (JSON.stringify(s)));
        data = formatPayload({
          signature: file,
          course: course?._id,
          date: attendanceSheetToAdd[0],
          slots,
          trainer: loggedUserId,
        });
      }
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
      nextScreenName={isSingle ? SLOTS_SELECTION : UPLOAD_METHOD} courseType={course!.type}
      areDataMissing={!attendanceSheetToAdd.length} currentScreenName={DATA_SELECTION}>
      {course?.type === INTER_B2B
        ? <MultipleCheckboxList optionsGroups={[missingAttendanceSheets]} setOptions={setDataOption}
          checkedList={attendanceSheetToAdd}/>
        : <RadioButtonList options={missingAttendanceSheets} setOption={value => setDataOption(value ? [value] : [])}
          checkedRadioButton={attendanceSheetToAdd[0]} />}
    </AttendanceSheetSelectionForm>
  );

  const renderSlotSelection = () => {
    const filteredSlotOptions = slotsOptions.map(group =>
      group.filter(s => attendanceSheetToAdd.every((trainee) => {
        const isTraineeConcerned = !s.trainees || s.trainees.includes(trainee);
        if (!isTraineeConcerned) return false;
        const isTraineePresent = !s.missingAttendances || !s.missingAttendances.some(a => a.trainee === trainee);
        return isTraineePresent;
      })));
    return <AttendanceSheetSelectionForm title={slotSelectionTitle} error={errorSlots}
      dispatchErrorSlots={dispatchErrorSlots} nextScreenName={isSingle ? UPLOAD_METHOD : ATTENDANCE_SIGNATURE}
      courseType={course!.type} currentScreenName={SLOTS_SELECTION} areDataMissing={!slotsToAdd.length}>
      <MultipleCheckboxList optionsGroups={filteredSlotOptions} groupTitles={Object.keys(groupedSlotsToBeSigned)}
        setOptions={setSlotsOptions} checkedList={slotsToAdd}/>
    </AttendanceSheetSelectionForm>;
  };

  const renderTraineesAttendanceSelection = () => (
    <AttendanceSheetSelectionForm title={'Quels apprenants ont été présents aux créneaux ?'} error={errorTrainees}
      nextScreenName={ATTENDANCE_SIGNATURE} dispatchErrorTrainees={dispatchErrorTrainees} courseType={course?.type}
      currentScreenName={TRAINEES_ATTENDANCES} areDataMissing={!Object.values(traineesBySlotToAdd).flat().length}
      setTraineesAttendanceOptions={setTraineesAttendanceOptions}>
      <MultipleCheckboxList optionsGroups={traineesOptions} groupTitles={traineesAttendanceTitles}
        setOptions={setTraineesBySlotOptions} checkedList={Object.values(traineesBySlotToAdd)} />
    </AttendanceSheetSelectionForm>
  );

  const renderUploadMethod = () => (
    <UploadMethods course={course!} goToParent={navigation.goBack} attendanceSheetToAdd={attendanceSheetToAdd}
      slotsToAdd={slotsToAdd} />
  );

  const setSlotsOptionsForSummary = () => setSelectedSlotsOptions(
    slotsOptions.map(group => group.filter(opt => slotsToAdd.includes(opt.value))).filter(g => g.length)
  );

  const setTraineesOptionsForSummary = () => {
    const options = traineesOptions[0];
    const optionMap = new Map(options.map(o => [o.value, o]));
    setSelectedTraineesOptions(
      Object.values(traineesBySlotToAdd).map(values => values.map(v => optionMap.get(v)!))
    );
  };

  const renderSignatureContainer = () => (
    <AttendanceSignatureContainer signature={signature} resetError={() => dispatchErrorSignature({ type: RESET_ERROR })}
      error={errorSignature} setSignature={setSignature} dispatchErrorSignature={dispatchErrorSignature} />
  );

  const renderSummary = () => (isSingle || course?.type === INTER_B2B
    ? <AttendanceSheetSummary signature={signature} saveAttendances={saveAttendances}
      dispatchErrorConfirmation={dispatchErrorConfirmation} error={errorConfirmation}
      titlesName={getFilteredStepsName()} isLoading={isLoading} setConfirmation={setConfirmationCheckbox}
      confirmation={confirmation} setSelectedOptions={setSlotsOptionsForSummary}
      target={target} options={selectedSlotsOptions} />
    : <AttendanceSheetSummary signature={signature} saveAttendances={saveAttendances}
      dispatchErrorConfirmation={dispatchErrorConfirmation} error={errorConfirmation}
      titlesName={traineesAttendanceTitles.filter((_, index) => Object.values(traineesBySlotToAdd)[index].length)}
      isLoading={isLoading} setConfirmation={setConfirmationCheckbox}
      confirmation={confirmation} setSelectedOptions={setTraineesOptionsForSummary}
      target={`le ${CompaniDate(attendanceSheetToAdd[0]).format(DD_MM_YYYY)}`} options={selectedTraineesOptions} />
  );
  const renderEndScreen = () => (
    <AttendanceEndScreen goToNextScreen={navigation.goBack}
      target={`${isSingle || course?.type === INTER_B2B ? 'à' : 'pour le'} ${target}`}
      failUpload={failUpload} />
  );

  const Stack = createStackNavigator<RootCreateAttendanceSheetParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={DATA_SELECTION}>
      <Stack.Screen key={0} name={DATA_SELECTION}>{renderDataSelection}</Stack.Screen>
      <Stack.Screen key={1} name={UPLOAD_METHOD}>{renderUploadMethod}</Stack.Screen>
      {(isSingle || course?.type === INTER_B2B)
        ? <Stack.Screen key={2} name={SLOTS_SELECTION}>{renderSlotSelection}</Stack.Screen>
        : <Stack.Screen key={3} name={TRAINEES_ATTENDANCES}>{renderTraineesAttendanceSelection}</Stack.Screen>}
      <Stack.Screen key={4} name={ATTENDANCE_SIGNATURE}>{renderSignatureContainer}</Stack.Screen>
      <Stack.Screen key={5} name={ATTENDANCE_SUMMARY}>{renderSummary}</Stack.Screen>
      <Stack.Screen options={{ gestureEnabled: false }} key={6} name={END_SCREEN}>{renderEndScreen}</Stack.Screen>
    </Stack.Navigator>
  );
};

export default CreateAttendanceSheet;
