// @ts-nocheck

import { useContext, useState } from 'react';
import { View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import FeatherButton from '../../components/icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { RootCreateAccountParamList, RootStackParamList } from '../../types/NavigationType';
import commonStyles from '../../styles/common';
import styles from './styles';
import { GREY } from '../../styles/colors';
import CreateAccountForm from '../../components/CreateAccountForm';
import ProgressBar from '../../components/cards/ProgressBar';
import Users from '../../api/users';
import { formatPhoneForPayload } from '../../core/helpers/utils';
import { AuthContextType, Context as AuthContext } from '../../context/AuthContext';
import { ACCOUNT_CREATION } from '../../core/data/constants';
import { tabsNames } from '../../core/data/tabs';

interface CreateAccountProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'CreateAccount'>,
StackScreenProps<RootCreateAccountParamList>
> {}

type CreateAccountDataType = {
  type: string,
  field: string,
  title: string,
  caption: string,
  value: string,
  isValid: boolean,
  errorMessage: string,
  isValidationAttempted: boolean,
  required: boolean,
  openUrl?: { text: string, link: string },
}

const formatCreationPayload = (formList: CreateAccountDataType[][], email) => {
  const data = {
    identity: formList[0][0].value === ''
      ? { lastname: formList[1][0].value }
      : { lastname: formList[1][0].value, firstname: formList[0][0].value },
    local: { email, password: formList[3][0].value },
  };

  return Object.assign(
    data,
    formList[2][0].value.phone === '' ? null : { contact: formatPhoneForPayload(formList[2][0].value) }
  );
};

const CreateAccount = ({ route, navigation }: CreateAccountProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { email } = route.params;
  const { signIn }: AuthContextType = useContext(AuthContext);
  const [formList, setFormList] = useState<CreateAccountDataType[][]>([
    [{
      type: 'text',
      field: 'firstname',
      title: 'Quel est votre prénom ?',
      caption: 'Prénom',
      value: '',
      isValid: true,
      errorMessage: '',
      isValidationAttempted: false,
      required: false,
    }],
    [{
      type: 'text',
      field: 'lastname',
      title: 'Quel est votre nom ?',
      caption: 'Nom',
      value: '',
      isValid: false,
      errorMessage: 'Ce champ est obligatoire',
      isValidationAttempted: false,
      required: true,
    }],
    [{
      type: 'contact',
      field: 'contact',
      title: 'Quel est votre téléphone ?',
      value: { phone: '', countryCode: '+33' },
      isValid: true,
      errorMessage: 'Votre numéro de téléphone n\'est pas valide',
      isValidationAttempted: false,
      required: false,
    }],
    [{
      type: 'password',
      field: 'password',
      title: 'Créer votre mot de passe',
      caption: 'Mot de passe',
      value: '',
      isValid: false,
      errorMessage: 'Le mot de passe doit comporter au minimum 6 caractères',
      isValidationAttempted: false,
      required: true,
    },
    {
      type: 'password',
      field: 'confirmedPassword',
      title: 'Créer votre mot de passe',
      caption: 'Confirmer mot de passe',
      value: '',
      isValid: false,
      errorMessage: 'Votre mot de passe et sa confirmation ne correspondent pas',
      isValidationAttempted: false,
      required: true,
      openUrl: {
        text: 'En continuant, vous acceptez nos ',
        link: 'conditions d\'utilisation et notre politique de confidentialité',
      },
    }],
  ]);

  const goBack = i => (i > 0
    ? navigation.navigate(`create-account-screen-${i - 1}`)
    : navigation.navigate('EmailForm', { firstConnection: true }));

  const setForm = (data, index) => {
    setFormList(prevFormList => (prevFormList.map((fieldsGroup, i) => (i === index ? data : fieldsGroup))));
  };

  const create = async () => {
    try {
      setIsLoading(true);
      await Users.create(formatCreationPayload(formList, email));
      signIn({ email, password: formList[3][0].value, mobileConnectionMode: ACCOUNT_CREATION });
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderScreen = (fields: CreateAccountDataType[], i: number) => (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <FeatherButton name='arrow-left' onPress={() => goBack(i)} size={ICON.MD} color={GREY[600]}
          disabled={isLoading} />
        <View style={commonStyles.progressBarContainer}>
          <ProgressBar progress={((i + 1) / formList.length) * 100} />
        </View>
      </View>
      <CreateAccountForm isLoading={isLoading} data={fields} setData={setForm} index={i} goBack={goBack}
        create={create} openUrl={() => Linking.openURL('https://www.compani.fr/cgu-cgv')} />
    </SafeAreaView>
  );

  const Stack = createStackNavigator<RootCreateAccountParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {formList.map((fields, i) => (
        <Stack.Screen key={fields[0].title} name={`create-account-screen-${i}`}
          options={{ title: tabsNames.CreateAccount }}>
          {() => renderScreen(fields, i)}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
};

export default CreateAccount;
