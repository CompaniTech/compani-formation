import { useEffect, useReducer, useRef, useState } from 'react';
import { Text, View, TextInput, Keyboard, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import get from 'lodash/get';
import BottomModal from '../BottomModal';
import NiPrimaryButton from '../form/PrimaryButton';
import Authentication from '../../api/authentication';
import { EMAIL, IDENTITY_VERIFICATION, MOBILE, PHONE } from '../../core/data/constants';
import { formatPhone } from '../../core/helpers/utils';
import { GREY } from '../../styles/colors';
import { IS_LARGE_SCREEN } from '../../styles/metrics';
import styles from './styles';
import { errorReducer, initialErrorState, RESET_ERROR, SET_ERROR } from '../../reducers/error';

interface ForgotPasswordModalProps {
  visible: boolean,
  email: string,
  setForgotPasswordModal: (value: boolean) => void,
}

const ForgotPasswordModal = ({ visible, email, setForgotPasswordModal }: ForgotPasswordModalProps) => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const [error, dispatchError] = useReducer(errorReducer, initialErrorState);
  const inputRefs = useRef<TextInput[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const [codeRecipient, setCodeRecipient] = useState<string>('');
  const [chosenMethod, setChosenMethod] = useState<string>('');

  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
    const showListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    return () => {
      hideListener.remove();
      showListener.remove();
    };
  }, []);

  useEffect(() => {
    const isCodeInvalid = !(code.every(char => char !== '' && Number.isInteger(Number(char))));
    if (isCodeInvalid) {
      const payload = isValidationAttempted ? 'Le format du code est incorrect' : '';
      dispatchError({ type: SET_ERROR, payload });
    } else { dispatchError({ type: RESET_ERROR }); }
  }, [code, isValidationAttempted]);

  const onChangeText = (text: string, index: number) => {
    if (text.length > 1) {
      const chars = text.split('').slice(0, 4);
      setCode((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => { next[i] = c; });
        return next;
      });
      global.requestAnimationFrame(() => {
        inputRefs.current[index - 1]?.focus();
      });
      return;
    }

    setCode((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });

    if (text && index < inputRefs.current.length) {
      global.requestAnimationFrame(() => {
        inputRefs.current[index + 1]?.focus();
      });
    }

    if (!text && index > 0) {
      global.requestAnimationFrame(() => {
        inputRefs.current[index - 1]?.focus();
      });
    }
  };

  const formatCode = async () => {
    Keyboard.dismiss();
    const formattedCode = code.join('');
    setIsValidationAttempted(true);
    if (!error.value) await sendCode(formattedCode);
  };

  const onRequestClose = () => {
    setCode(['', '', '', '']);
    setIsKeyboardOpen(false);
    setIsValidationAttempted(false);
    dispatchError({ type: RESET_ERROR });
    setCodeRecipient('');
    setChosenMethod('');
    setForgotPasswordModal(false);
  };

  const sendCode = async (formattedCode: string) => {
    try {
      setIsLoading(true);
      const checkToken = await Authentication.passwordToken({ email }, formattedCode);
      navigation.navigate(
        'PasswordReset',
        { userId: checkToken.user._id, email, token: checkToken.token, mobileConnectionMode: IDENTITY_VERIFICATION }
      );
      setTimeout(onRequestClose, 200);
    } catch (_) {
      dispatchError({ type: SET_ERROR, payload: 'Oops, le code n\'est pas valide' });
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    try {
      setIsLoading(true);
      setChosenMethod(EMAIL);
      await Authentication.forgotPassword({ email, origin: MOBILE, type: EMAIL });
      setCodeRecipient(email);
      dispatchError({ type: RESET_ERROR });
    } catch (e: any) {
      const payload = e.response?.status === 404
        ? 'Oops, on ne reconnaît pas cet e-mail'
        : 'Oops, erreur lors de la transmission de l\'e-mail';
      dispatchError({ type: SET_ERROR, payload });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSMS = async () => {
    try {
      setIsLoading(true);
      setChosenMethod(PHONE);
      const sms = await Authentication.forgotPassword({ email, origin: MOBILE, type: PHONE });
      setCodeRecipient(get(sms, 'phone') ? `${formatPhone(sms!)}` : '');
      dispatchError({ type: RESET_ERROR });
    } catch (e: any) {
      const payload = e.response?.status === 409
        ? 'Oops, nous n\'avons pas trouvé de numéro de téléphone associé à votre compte'
        : 'Oops, erreur lors de la transmission du numéro de téléphone';
      dispatchError({ type: SET_ERROR, payload });
    } finally {
      setIsLoading(false);
    }
  };

  const beforeCodeSent = () => (
    <>
      <Text style={styles.beforeCodeSentText}>
        Pour réinitialiser votre mot de passe, vous devez d’abord confirmer votre identité par un code temporaire.
      </Text>
      <NiPrimaryButton caption='Recevoir le code par e-mail' customStyle={styles.button} onPress={sendEmail}
        loading={isLoading && chosenMethod === EMAIL} />
      <NiPrimaryButton caption='Recevoir le code par SMS' customStyle={styles.button} onPress={sendSMS}
        loading={isLoading && chosenMethod === PHONE} />
      <Text style={styles.unvalid}>{error.message}</Text>
    </>);

  const afterCodeSent = () => (
    <>
      {(IS_LARGE_SCREEN || !isKeyboardOpen) &&
        <>
          {chosenMethod === EMAIL
            ? <Text style={styles.afterCodeSentText}>
              Nous avons envoyé un e-mail à<Text style={styles.recipient}> {codeRecipient} </Text>
              avec le code temporaire. Si vous ne l’avez pas reçu, vérifiez votre courrier indésirable, ou réessayez.
            </Text>
            : <Text style={styles.afterCodeSentText}>
              Nous avons envoyé un SMS au
              <Text style={styles.recipient}> {codeRecipient} </Text>
              avec le code temporaire.
            </Text>}
          <Text style={styles.afterCodeSentText}>Saisie du code temporaire</Text>
        </>}
      <View style={styles.inputContainer}>
        {[0, 1, 2, 3].map(idx => (
          <TextInput ref={(r) => { inputRefs.current[idx] = r!; }} key={idx} value={code[idx]}
            onChangeText={char => onChangeText(char, idx)} style={styles.input} placeholder={'_'}
            placeholderTextColor={GREY[600]} maxLength={1} keyboardType={'number-pad'}
            autoCorrect={false} autoComplete="off" selectTextOnFocus />))}
      </View>
      <NiPrimaryButton caption='Valider' customStyle={styles.button} onPress={formatCode} loading={isLoading} />
      {error.value && <Text style={styles.unvalid}>{error.message}</Text>}
    </>
  );

  return (
    <BottomModal onRequestClose={onRequestClose} visible={visible}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.title}>Confirmez votre identité</Text>
        {!codeRecipient ? beforeCodeSent() : afterCodeSent()}
      </ScrollView>
    </BottomModal>
  );
};

export default ForgotPasswordModal;
