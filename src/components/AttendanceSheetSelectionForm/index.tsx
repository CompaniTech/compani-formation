import { ScrollView, View, Text, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActionDispatch, useCallback } from 'react';
import styles from './styles';
import NiPrimaryButton from '../form/PrimaryButton';
import NiErrorMessage from '../ErrorMessage';
import { ErrorActionType, ErrorStateType, RESET_ERROR, SET_ERROR } from '../../reducers/error';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import {
  ATTENDANCE_SIGNATURE,
  DATA_SELECTION,
  INTER_B2B, IS_WEB,
  SINGLE,
  SLOTS_SELECTION,
  UPLOAD_METHOD,
} from '../../core/data/constants';

export type ScreenType = typeof DATA_SELECTION | typeof SLOTS_SELECTION | typeof UPLOAD_METHOD |
  typeof ATTENDANCE_SIGNATURE;

interface AttendanceSheetSelectionFormProps {
  title: string,
  attendanceSheetToAdd?: string[]
  courseType?: string,
  areSlotsMissing?: boolean,
  currentScreenName?: ScreenType,
  nextScreenName: ScreenType,
  dispatchErrorData?: ActionDispatch<[action: ErrorActionType]>,
  dispatchErrorSlots?:ActionDispatch<[action: ErrorActionType]>,
  error: ErrorStateType,
  children: any,
}

const AttendanceSheetSelectionForm = ({
  title,
  attendanceSheetToAdd = [],
  courseType = '',
  areSlotsMissing = false,
  currentScreenName,
  nextScreenName,
  dispatchErrorData = () => {},
  dispatchErrorSlots = () => {},
  error,
  children,
}: AttendanceSheetSelectionFormProps) => {
  const navigation = useNavigation();

  const goToNextScreen = () => {
    dispatchErrorData({ type: RESET_ERROR });
    navigation.navigate(nextScreenName);
  };

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
      if (areSlotsMissing) dispatchErrorSlots({ type: SET_ERROR, payload: 'Veuillez sélectionner des créneaux' });
      else goToNextScreen();
    } else if (currentScreenName === DATA_SELECTION) {
      if (!attendanceSheetToAdd.length) {
        dispatchErrorData({
          type: SET_ERROR,
          payload: [INTER_B2B, SINGLE].includes(courseType)
            ? 'Veuillez sélectionner un stagiaire'
            : 'Veuillez sélectionner une date',
        });
      } else goToNextScreen();
    } else goToNextScreen();
  };

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
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
