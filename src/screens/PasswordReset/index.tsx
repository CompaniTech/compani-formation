// @ts-nocheck

import { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/NavigationType';
import PasswordForm from '../../components/PasswordForm';
import Authentication from '../../api/authentication';
import { AuthContextType, Context as AuthContext } from '../../context/AuthContext';
import { EDGES } from '../../styles/metrics';
import styles from './styles';

interface PasswordResetProps extends StackScreenProps<RootStackParamList, 'PasswordReset'> {}

const PasswordReset = ({ route, navigation }: PasswordResetProps) => {
  const { userId, email, token, mobileConnectionMode } = route.params;
  const { signIn }: AuthContextType = useContext(AuthContext);

  const goBack = () => { navigation.goBack(); };

  const savePassword = async (password: string) => {
    await Authentication.updatePassword(userId, { local: { password } }, token);
    await signIn({ email, password, mobileConnectionMode });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <PasswordForm goBack={goBack} onPress={savePassword} email={email} />
    </SafeAreaView>
  );
};

export default PasswordReset;
