// @ts-nocheck

import { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import NiInput from '../../components/form/Input';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import NiSecondaryButton from '../../components/form/SecondaryButton';
import NiErrorMessage from '../../components/ErrorMessage';
import FirstConnectionModal from '../../components/FirstConnectionModal';
import { AuthContextType, Context as AuthContext } from '../../context/AuthContext';
import { AUTHENTICATION, IS_IOS } from '../../core/data/constants';
import { EDGES } from '../../styles/metrics';
import { useResetAllReducers } from '../../store/hooks';
import commonStyles from '../../styles/common';
import { RootStackParamList } from '../../types/NavigationType';
import styles from './styles';

interface AuthenticationProps extends StackScreenProps<RootStackParamList> {}

const Authentication = ({ navigation }: AuthenticationProps) => {
  const resetAllReducers = useResetAllReducers();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isFirstConnection, setIsFirstConnection] = useState<boolean>(false);
  const { signIn, loading, error, errorMessage, resetError }: AuthContextType = useContext(AuthContext);

  useEffect(() => {
    resetAllReducers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPress = () => signIn({ email, password, mobileConnectionMode: AUTHENTICATION });
  const forgotPassword = () => {
    resetError();
    navigation.navigate('EmailForm', { firstConnection: false });
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={EDGES}>
      <ImageBackground style={styles.image}
        source={require('../../../assets/images/authentication_background_image.webp')}>
        <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.inner}>
            <Text style={styles.title}>
              Identifiez-vous pour{'\n'}accéder aux informations
            </Text>
            <NiInput caption="Email" value={email} onChangeText={value => setEmail(value.trim())} type="email"
              darkMode />
            <NiInput caption="Mot de passe" value={password} onChangeText={setPassword} type="password" darkMode />
            <TouchableOpacity style={styles.forgotPassword} onPress={forgotPassword} hitSlop={{ top: 12, bottom: 12 }}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            <NiErrorMessage message={errorMessage} show={error} />
            <NiPrimaryButton customStyle={styles.button} caption="Se connecter" onPress={onPress} loading={loading} />
            <NiSecondaryButton caption="C'est ma première connexion" onPress={() => setIsFirstConnection(true)} />
            <FirstConnectionModal onRequestClose={() => setIsFirstConnection(false)} visible={isFirstConnection} />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Authentication;
