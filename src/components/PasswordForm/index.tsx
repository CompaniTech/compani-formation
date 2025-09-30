import { useEffect, useRef, useState, useReducer } from 'react';
import {
  Text,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import FeatherButton from '../icons/FeatherButton';
import NiPrimaryButton from '../form/PrimaryButton';
import { GREY } from '../../styles/colors';
import { ICON, IS_LARGE_SCREEN, MARGIN } from '../../styles/metrics';
import styles from './styles';
import NiInput from '../form/Input';
import ConfirmationModal from '../ConfirmationModal';
import NiErrorMessage from '../ErrorMessage';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../reducers/error';
import { IS_IOS, IS_WEB } from '../../core/data/constants';

const NEW_PASSWORD = 'newPassword';
const CONFIRMED_PASSWORD = 'confirmedPassword';

interface PasswordFormProps {
  goBack: () => void,
  onPress: (password: string) => void,
  email?: string,
}

const PasswordForm = ({ onPress, goBack, email = '' }: PasswordFormProps) => {
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [password, setPassword] =
    useState<{ newPassword: string, confirmedPassword: string }>({ newPassword: '', confirmedPassword: '' });
  const [unvalid, setUnvalid] = useState({ newPassword: false, confirmedPassword: false });
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, dispatchError] = useReducer(errorReducer, initialErrorState);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  const keyboardDidHide = () => Keyboard.dismiss();

  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => { hideListener.remove(); };
  });

  const hardwareBackPress = () => {
    setExitConfirmationModal(true);
    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, []);

  useEffect(() => {
    setUnvalid({
      newPassword: password.newPassword.length < 6,
      confirmedPassword: password.confirmedPassword !== password.newPassword,
    });
  }, [password]);

  useEffect(() => {
    const { newPassword, confirmedPassword } = unvalid;
    setIsValid(!(newPassword || confirmedPassword));
  }, [unvalid]);

  const toggleModal = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    goBack();
  };

  const savePassword = async () => {
    try {
      setIsValidationAttempted(true);
      if (isValid) {
        setIsLoading(true);
        dispatchError({ type: RESET_ERROR });

        await onPress(password.newPassword);
      }
    } catch (e: any) {
      console.error(e);
      dispatchError({
        type: SET_ERROR,
        payload: 'Erreur, si le problème persiste, contactez le support technique',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setPasswordField = (text: string, key: typeof NEW_PASSWORD | typeof CONFIRMED_PASSWORD) => {
    setPassword({ ...password, [key]: text });
  };

  return (
    <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS} >
      <View style={styles.goBack}>
        <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD}
          color={GREY[600]} disabled={isLoading} />
        <ConfirmationModal onPressConfirmButton={toggleModal} visible={exitConfirmationModal}
          title="Êtes-vous sûr(e) de cela ?" onPressCancelButton={() => setExitConfirmationModal(false)}
          contentText="Vos modifications ne seront pas enregistrées" />
      </View>
      <ScrollView contentContainerStyle={styles.container} ref={scrollRef} showsVerticalScrollIndicator={IS_WEB}>
        <Text style={styles.title}>Modifier mon mot de passe</Text>
        {!!email && <Text style={styles.email}>L&apos;e-mail associé à votre compte est :
          <Text style={styles.bold}>&nbsp;{email}</Text>
        </Text>}
        <NiInput caption="Nouveau mot de passe" value={password.newPassword}
          type="password" onChangeText={text => setPasswordField(text, NEW_PASSWORD)}
          validationMessage={unvalid.newPassword && isValidationAttempted
            ? 'Le mot de passe doit comporter au minimum 6 caractères'
            : ''} customStyle={styles.input} />
        <NiInput caption="Confirmer mot de passe" value={password.confirmedPassword}
          type="password" onChangeText={text => setPasswordField(text, CONFIRMED_PASSWORD)}
          validationMessage={unvalid.confirmedPassword && isValidationAttempted
            ? 'Votre nouveau mot de passe et sa confirmation ne correspondent pas'
            : ''} customStyle={styles.input} />
        <View style={styles.footer}>
          <NiErrorMessage message={error.message} show={error.value} />
          <NiPrimaryButton caption="Valider" onPress={savePassword} loading={isLoading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PasswordForm;
