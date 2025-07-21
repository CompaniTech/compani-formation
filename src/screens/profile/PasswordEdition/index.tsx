import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList, RootBottomTabParamList } from '../../../types/NavigationType';
import PasswordForm from '../../../components/PasswordForm';
import Authentication from '../../../api/authentication';
import styles from './styles';

interface PasswordEditionProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'PasswordEdition'>,
StackScreenProps<RootBottomTabParamList>
> {}

const PasswordEdition = ({ route, navigation }: PasswordEditionProps) => {
  const { userId } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const savePassword = async (password: string) => {
    await Authentication.updatePassword(userId, { local: { password } });
    goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <PasswordForm goBack={goBack} onPress={savePassword} />
    </SafeAreaView>
  );
};

export default PasswordEdition;
