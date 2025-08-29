import { ScrollView, View, Text, BackHandler, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActionDispatch, useCallback, useEffect } from 'react';
import { ErrorActionType, ErrorStateType, RESET_ERROR, SET_ERROR } from '../../reducers/error';
import { DataOptionsType } from '../../store/attendanceSheets/slice';
import NiErrorMessage from '../../components/ErrorMessage';
import Checkbox from '../form/Checkbox';
import MultipleCheckboxList from '../form/MultipleCheckboxList';
import NiPrimaryButton from '../form/PrimaryButton';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import { END_SCREEN, IS_WEB } from '../../core/data/constants';
import styles from './styles';

interface AttendanceSheetSummaryProps {
  titlesName: string[],
  options: DataOptionsType[][],
  signature: string,
  isLoading: boolean,
  setConfirmation: () => void,
  dispatchErrorConfirmation: ActionDispatch<[action: ErrorActionType]>
  saveAttendances: () => void,
  setSelectedOptions?: () => void,
  confirmation: boolean,
  error: ErrorStateType,
  target: string,
}

const AttendanceSheetSummary = ({
  titlesName,
  options,
  signature,
  isLoading,
  setConfirmation,
  dispatchErrorConfirmation,
  saveAttendances,
  setSelectedOptions = () => {},
  confirmation,
  error,
  target,
}: AttendanceSheetSummaryProps) => {
  const navigation = useNavigation();
  const checkedList = options.flat().map(option => option.value);

  useEffect(() => {
    setSelectedOptions();
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

  const saveAndGoToEndScreen = async () => {
    if (!confirmation) {
      dispatchErrorConfirmation({ type: SET_ERROR, payload: 'Veuillez cocher la case ci-dessous' });
    } else {
      dispatchErrorConfirmation({ type: RESET_ERROR });
      await saveAttendances();
      navigation.navigate(END_SCREEN);
    }
  };

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <View style={styles.header}>
      <FeatherButton name='arrow-left' onPress={() => navigation.goBack()} size={ICON.MD} color={GREY[600]} />
    </View>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={IS_WEB}>
      <Text style={styles.title}>Emargements pour {target}</Text>
      <MultipleCheckboxList optionsGroups={options} disabled groupTitles={titlesName} checkedList={checkedList} />
      <Image source={{ uri: signature }} style={styles.image} />
    </ScrollView>
    <View style={styles.checkboxContainer}>
      <Checkbox itemLabel={'Je certifie que les informations ci-dessus sont exactes'} isChecked={confirmation}
        onPressCheckbox={setConfirmation} />
    </View>
    <View style={styles.button}>
      <NiErrorMessage message={error.message} show={error.value} />
      <NiPrimaryButton caption={'Suivant'} onPress={saveAndGoToEndScreen} loading={isLoading} />
    </View>
  </SafeAreaView>;
};
export default AttendanceSheetSummary;
