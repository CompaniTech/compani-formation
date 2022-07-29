import { useEffect, useState, useCallback, useReducer } from 'react';
import { Text, View, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import ExitModal from '../../components/ExitModal';
import FeatherButton from '../../components/icons/FeatherButton';
import { ICON, IS_LARGE_SCREEN, MARGIN } from '../../styles/metrics';
import { RootStackParamList } from '../../types/NavigationType';
import NiInput from '../../components/form/Input';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import styles from './styles';
import accountCreationStyles from '../../styles/accountCreation';
import { GREY } from '../../styles/colors';
import { EMAIL_REGEX } from '../../core/data/constants';
import Users from '../../api/users';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../reducers/error';

interface EmailFormProps extends StackScreenProps<RootStackParamList, 'EmailForm'> {}

const EmailForm = ({ route, navigation }: EmailFormProps) => {
  const [behavior, setBehavior] = useState<'padding' | 'height'>('padding');
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [error, dispatchError] = useReducer(errorReducer, initialErrorState);

  const hardwareBackPress = useCallback(() => {
    if (!isLoading) setExitConfirmationModal(true);
    return true;
  }, [isLoading]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  }, [hardwareBackPress]);

  useEffect(() => {
    if (Platform.OS === 'ios') setBehavior('padding');
    else setBehavior('height');
  }, []);

  useEffect(() => {
    const isEmailInvalid = !email.match(EMAIL_REGEX);
    if (isEmailInvalid) {
      const payload = isValidationAttempted ? 'Votre e-mail n\'est pas valide' : '';
      dispatchError({ type: SET_ERROR, payload });
    } else dispatchError({ type: RESET_ERROR });
  }, [email, isValidationAttempted]);

  const validateEmail = async () => {
    try {
      setIsValidationAttempted(true);
      if (!error.value) {
        setIsLoading(true);
        const isExistingUser = await Users.exists({ email });
        if (isExistingUser) await setForgotPasswordModal(true);
        else if (!route.params?.firstConnection) {
          dispatchError({ type: SET_ERROR, payload: 'Oups ! Cet e-mail n\'est pas reconnu' });
        } else navigation.navigate('CreateAccount', { email });
      }
    } catch (e) {
      dispatchError({ type: SET_ERROR, payload: 'Oops, erreur lors de la vérification de l\'e-mail' });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    navigation.navigate('Authentication');
  };

  const enterEmail = text => setEmail(text.trim());

  return (
    <KeyboardAvoidingView behavior={behavior} style={accountCreationStyles.screenView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS}>
      <View style={styles.goBack}>
        <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD} color={GREY[600]}
          disabled={isLoading} />
        <ExitModal onPressConfirmButton={goBack} visible={exitConfirmationModal}
          onPressCancelButton={() => setExitConfirmationModal(false)}
          title="Êtes-vous sûr(e) de cela ?" contentText={'Vous reviendrez à la page d\'accueil.'} />
      </View>
      <View style={accountCreationStyles.container}>
        <Text style={accountCreationStyles.title}>Quel est votre e-mail ?</Text>
        <View style={accountCreationStyles.input}>
          <NiInput caption="E-mail" value={email} type="email" validationMessage={error.message}
            disabled={isLoading} onChangeText={enterEmail} />
        </View>
        <View style={accountCreationStyles.footer}>
          <NiPrimaryButton caption="Valider" onPress={validateEmail} loading={isLoading} />
        </View>
        <ForgotPasswordModal email={email} setForgotPasswordModal={setForgotPasswordModal}
          visible={forgotPasswordModal} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EmailForm;
