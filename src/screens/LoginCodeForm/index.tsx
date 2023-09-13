import { useState, createRef } from 'react';
import { View, Text, TextInput, TextInputKeyPressEventData, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/NavigationType';
import FeatherButton from '../../components/icons/FeatherButton';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import ExitModal from '../../components/ExitModal';
import NiInput from '../../components/form/Input';
import { isIOS } from '../../core/data/constants';
import { GREY } from '../../styles/colors';
import { ICON } from '../../styles/metrics';
import styles from './styles';

interface LoginCodeFormProps extends StackScreenProps<RootStackParamList> {}

const LoginCodeForm = ({ navigation }: LoginCodeFormProps) => {
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs: any[] = [
    createRef(),
    createRef(),
    createRef(),
    createRef(),
  ];
  const [lastname, setLastname] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');

  const goBack = () => {
    setExitConfirmationModal(false);
    navigation.goBack();
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.goBack}>
        <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD}
          color={GREY[600]} disabled={isLoading} />
        <ExitModal onPressConfirmButton={goBack} visible={exitConfirmationModal}
          onPressCancelButton={() => setExitConfirmationModal(false)}
          title="Êtes-vous sûr(e) de cela ?" contentText={'Vous reviendrez à la page d\'accueil.'} />
      </View>
      <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.codeContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Code de connexion donné par le formateur</Text>
            <Text style={styles.required}>*</Text>
          </View>
          <View style={styles.code}>
            {inputRefs.map((k, idx) => (
              <TextInput ref={(r) => { inputRefs[idx] = r; }} key={`${k}${idx}`} value={code[idx]}
                onChangeText={char => onChangeText(char, idx)} style={styles.number} placeholder={'_'}
                onKeyPress={({ nativeEvent }) => checkKeyValue(nativeEvent.key, idx)}
                maxLength={1} keyboardType={'number-pad'} autoFocus={idx === 0} editable={!isLoading} />))}
          </View>
        </View>
        <NiInput caption={'Nom'} value={lastname} onChangeText={setLastname} type={'text'} required
          disabled={isLoading} />
        <NiInput caption={'Prénom'} value={firstname} onChangeText={setFirstname} type={'text'} required
          disabled={isLoading} />
        <View style={styles.footer}>
          <NiPrimaryButton caption="Valider" onPress={() => setIsLoading(true)} loading={isLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginCodeForm;
