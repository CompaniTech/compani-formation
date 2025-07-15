import { ScrollView, View, Text, BackHandler, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { ErrorStateType } from '../../reducers/error';
import { DataOptionsType } from '../../store/attendanceSheets/slice';
import NiErrorMessage from '../../components/ErrorMessage';
import Checkbox from '../form/Checkbox';
import MultipleCheckboxList from '../form/MultipleCheckboxList';
import NiPrimaryButton from '../form/PrimaryButton';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import { IS_WEB } from '../../core/data/constants';
import styles from './styles';

interface AttendanceSheetSummaryProps {
  goToNextScreen: () => void,
  stepsName: string[],
  slotsOptions: DataOptionsType[][],
  signature: string,
  isLoading: boolean,
  setConfirmation: () => void,
  confirmation: boolean,
  error: ErrorStateType,
  traineeName: string,
}

const AttendanceSheetSummary = ({
  goToNextScreen,
  stepsName,
  slotsOptions,
  signature,
  isLoading,
  setConfirmation,
  confirmation,
  error,
  traineeName,
}: AttendanceSheetSummaryProps) => {
  const navigation = useNavigation();
  const checkedList = slotsOptions.flat().map(option => option.value);

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

  return <SafeAreaView style={styles.safeArea} edges={['top']}>
    <View style={styles.header}>
      <FeatherButton name='arrow-left' onPress={() => navigation.goBack()} size={ICON.MD} color={GREY[600]} />
    </View>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={IS_WEB}>
      <Text style={styles.title}>Emargements pour {traineeName}</Text>
      <MultipleCheckboxList optionsGroups={slotsOptions} disabled groupTitles={stepsName} checkedList={checkedList} />
      <Image source={{ uri: signature }} style={styles.image} />
    </ScrollView>
    <View style={styles.checkboxContainer}>
      <Checkbox itemLabel={'Je certifie que les informations ci-dessus sont exactes'} isChecked={confirmation}
        onPressCheckbox={setConfirmation} />
    </View>
    <View style={styles.button}>
      <NiErrorMessage message={error.message} show={error.value} />
      <NiPrimaryButton caption={'Suivant'} onPress={goToNextScreen} loading={isLoading} />
    </View>
  </SafeAreaView>;
};
export default AttendanceSheetSummary;
