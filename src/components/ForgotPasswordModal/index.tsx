import { createRef, useEffect, useReducer, useState } from 'react';
import { Text, View, TextInput, Keyboard, TextInputKeyPressEventData, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import get from 'lodash/get';
import BottomModal from '../BottomModal';
import NiPrimaryButton from '../form/PrimaryButton';
import Authentication from '../../api/authentication';
import { EMAIL, IDENTITY_VERIFICATION, MOBILE, PHONE } from '../../core/data/constants';
import { formatPhone } from '../../core/helpers/utils';
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
  const inputRefs: any[] = [
    createRef(),
    createRef(),
    createRef(),
    createRef(),
  ];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const [codeRecipient, setCodeRecipient] = useState<string>('');
  const [chosenMethod, setChosenMethod] = useState<string>('');

  const keyboardDidHide = () => setIsKeyboardOpen(false);
  const keyboardDidShow = () => setIsKeyboardOpen(true);

  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    const showListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    return () => {
      hideListener.remove();
      showListener.remove();
    };
  });

  useEffect(() => {
    const isCodeInvalid = !(code.every(char => char !== '' && Number.isInteger(Number(char))));
    if (isCodeInvalid) {
      const payload = isValidationAttempted ? 'Le format du code est incorrect' : '';
      dispatchError({ type: SET_ERROR, payload });
    } else { dispatchError({ type: RESET_ERROR }); }
  }, [code, isValidationAttempted]);

  const onChangeText = (char: string, index: number) => {
    setCode(code.map((c, i) => (i === index ? char : c)));
    if (!!char && index + 1 < 4) inputRefs[index + 1].focus();
  };

  const goPreviousAfterEdit = (index: number) => {
    inputRefs[index].focus();
    if (code[index] !== '') onChangeText('', index);
  };

  const checkKeyValue = (key: TextInputKeyPressEventData['key'], idx: number) => {
    if (key === 'Backspace') {
      if (!idx && code[idx] === '') return;

      if (code[idx] === '') goPreviousAfterEdit(idx - 1);
      else onChangeText('', idx);
    }
  };

  const formatCode = () => {
    Keyboard.dismiss();
    const formattedCode = `${code[0]}${code[1]}${code[2]}${code[3]}`;
    setIsValidationAttempted(true);
    if (!error.value) sendCode(formattedCode);
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
      onRequestClose();
      navigation.navigate(
        'PasswordReset',
        { userId: checkToken.user._id, email, token: checkToken.token, mobileConnectionMode: IDENTITY_VERIFICATION }
      );
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
      const payload = e.response.status === 404
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
      const payload = e.response.status === 409
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
        {inputRefs.map((k, idx) => (
          <TextInput ref={(r) => { inputRefs[idx] = r; }} key={`${k}${idx}`} value={code[idx]}
            onChangeText={char => onChangeText(char, idx)} style={styles.input} placeholder={'_'}
            onKeyPress={({ nativeEvent }) => checkKeyValue(nativeEvent.key, idx)}
            maxLength={1} keyboardType={'number-pad'} autoFocus={idx === 0} />))}
      </View>
      <NiPrimaryButton caption='Valider' customStyle={styles.button} onPress={() => formatCode()} loading={isLoading} />
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
