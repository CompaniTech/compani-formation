import { ScrollView, View, Text, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActionDispatch, useCallback, useEffect } from 'react';
import styles from './styles';
import NiPrimaryButton from '../form/PrimaryButton';
import NiErrorMessage from '../ErrorMessage';
import { ErrorActionType, ErrorStateType, SET_ERROR } from '../../reducers/error';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import {
  ATTENDANCE_SIGNATURE,
  DATA_SELECTION,
  INTER_B2B,
  INTRA,
  INTRA_HOLDING,
  IS_WEB,
  SINGLE,
  SLOTS_SELECTION,
  TRAINEES_ATTENDANCES,
  UPLOAD_METHOD,
} from '../../core/data/constants';

export type ScreenType = typeof DATA_SELECTION | typeof SLOTS_SELECTION | typeof UPLOAD_METHOD |
  typeof ATTENDANCE_SIGNATURE | typeof TRAINEES_ATTENDANCES;

interface AttendanceSheetSelectionFormProps {
  title: string,
  courseType?: string,
  areDataMissing?: boolean,
  currentScreenName?: ScreenType,
  nextScreenName: ScreenType,
  dispatchErrorData?: ActionDispatch<[action: ErrorActionType]>,
  dispatchErrorSlots?:ActionDispatch<[action: ErrorActionType]>,
  dispatchErrorTrainees?:ActionDispatch<[action: ErrorActionType]>,
  setTraineesAttendanceOptions?: () => void,
  error: ErrorStateType,
  children: any,
}

const AttendanceSheetSelectionForm = ({
  title,
  courseType = '',
  areDataMissing = false,
  currentScreenName,
  nextScreenName,
  dispatchErrorData = () => {},
  dispatchErrorSlots = () => {},
  dispatchErrorTrainees = () => {},
  setTraineesAttendanceOptions = () => {},
  error,
  children,
}: AttendanceSheetSelectionFormProps) => {
  const navigation = useNavigation();

  useEffect(() => {
    if ([INTRA, INTRA_HOLDING].includes(courseType)) setTraineesAttendanceOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      const hardwareBackPress = () => {
        navigation.goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

      return () => subscription.remove();
    }, [navigation])
  );

  const manageRedirection = () => {
    if (currentScreenName === SLOTS_SELECTION) {
      if (areDataMissing) dispatchErrorSlots({ type: SET_ERROR, payload: 'Veuillez sélectionner des créneaux' });
      else navigation.navigate(nextScreenName);
    } else if (currentScreenName === DATA_SELECTION) {
      if (areDataMissing) {
        dispatchErrorData({
          type: SET_ERROR,
          payload: [INTER_B2B, SINGLE].includes(courseType)
            ? 'Veuillez sélectionner un stagiaire'
            : 'Veuillez sélectionner une date',
        });
      } else navigation.navigate(nextScreenName);
    } else if (currentScreenName === TRAINEES_ATTENDANCES) {
      if (areDataMissing) dispatchErrorTrainees({ type: SET_ERROR, payload: 'Veuillez sélectionner des stagiaires' });
      else navigation.navigate(nextScreenName);
    } else navigation.navigate(nextScreenName);
  };

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <FeatherButton name='arrow-left' onPress={() => navigation.goBack()} size={ICON.MD} color={GREY[600]} />
    </View>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={IS_WEB}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </ScrollView>
    <View style={styles.button}>
      <NiErrorMessage message={error.message} show={error.value}/>
      <NiPrimaryButton caption={'Suivant'} onPress={manageRedirection}/>
    </View>
  </SafeAreaView>;
};
export default AttendanceSheetSelectionForm;
