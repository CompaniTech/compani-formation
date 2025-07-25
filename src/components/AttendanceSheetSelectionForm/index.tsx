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
import { INTER_B2B, IS_WEB, SINGLE, SLOTS_SELECTION, UPLOAD_METHOD } from '../../core/data/constants';

interface AttendanceSheetSelectionFormProps {
  title: string,
  attendanceSheetToAdd?: string
  courseType?: string,
  areSlotsMissing?: boolean,
  nextScreenName: string,
  dispatchErrorData?: ActionDispatch<[action: ErrorActionType]>,
  dispatchErrorSlots?:ActionDispatch<[action: ErrorActionType]>,
  error: ErrorStateType,
  children: any,
}

const AttendanceSheetSelectionForm = ({
  title,
  attendanceSheetToAdd = '',
  courseType = '',
  areSlotsMissing = false,
  nextScreenName,
  dispatchErrorData = () => {},
  dispatchErrorSlots = () => {},
  error,
  children,
}: AttendanceSheetSelectionFormProps) => {
  const navigation = useNavigation();

  const goToSlotSelection = () => {
    if (!attendanceSheetToAdd) {
      dispatchErrorData({ type: SET_ERROR, payload: 'Veuillez sélectionner un stagiaire' });
    } else {
      dispatchErrorData({ type: RESET_ERROR });
      navigation.navigate(SLOTS_SELECTION);
    }
  };

  const goToUploadMethod = () => {
    if (areSlotsMissing) {
      dispatchErrorSlots({ type: SET_ERROR, payload: 'Veuillez sélectionner des créneaux' });
    } else if (!attendanceSheetToAdd) {
      dispatchErrorData({
        type: SET_ERROR,
        payload: [INTER_B2B, SINGLE].includes(courseType)
          ? 'Veuillez sélectionner un stagiaire'
          : 'Veuillez sélectionner une date',
      });
    } else {
      dispatchErrorData({ type: RESET_ERROR });
      navigation.navigate(UPLOAD_METHOD);
    }
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

  const goToNextScreen = () => {
    if (nextScreenName === SLOTS_SELECTION) goToSlotSelection();
    else if (nextScreenName === UPLOAD_METHOD) goToUploadMethod();
    else navigation.navigate('attendance-signature');
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
      <NiPrimaryButton caption={'Suivant'} onPress={goToNextScreen}/>
    </View>
  </SafeAreaView>;
};
export default AttendanceSheetSelectionForm;
