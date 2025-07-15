import { ScrollView, View, Text, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import styles from './styles';
import NiPrimaryButton from '../form/PrimaryButton';
import NiErrorMessage from '../ErrorMessage';
import { ErrorStateType } from '../../reducers/error';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import { IS_WEB } from '../../core/data/constants';

interface AttendanceSheetSelectionFormProps {
  title: string,
  goToNextScreen: () => void,
  error: ErrorStateType,
  children: any,
}

const AttendanceSheetSelectionForm = ({
  title,
  goToNextScreen,
  error,
  children,
}: AttendanceSheetSelectionFormProps) => {
  const navigation = useNavigation();

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
