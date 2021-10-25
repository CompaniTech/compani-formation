import React, { useCallback, useEffect } from 'react';
import { Text, View, BackHandler, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NiInput from '../../components/form/Input';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import styles from './styles';
import accountCreationStyles from '../../styles/accountCreation';
import { PHONE_REGEX } from '../../core/data/constants';
import { IS_LARGE_SCREEN, MARGIN } from '../../styles/metrics';

interface CreateAccountFormProps {
  index: number
  data: any,
  isLoading: boolean,
  setData: (data: any, i: number) => void,
  goBack: (index: number) => void,
  create: () => void,
  openUrl: () => void,
}
const CreateAccountForm = ({ index, data, isLoading, setData, goBack, create, openUrl }: CreateAccountFormProps) => {
  const isIOS = Platform.OS === 'ios';
  const navigation = useNavigation();

  const hardwareBackPress = useCallback(() => {
    if (!isLoading) goBack(index);
    return true;
  }, [goBack, index, isLoading]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  }, [hardwareBackPress]);

  const onChangeText = (text, fieldToChangeIndex) => {
    setData(
      data.map((dataItem, fieldIndex) => {
        if (fieldIndex === fieldToChangeIndex) {
          return {
            ...dataItem,
            value: text,
            isValid: isFieldValid(
              dataItem.field,
              data.map((item, valueIndex) => (fieldToChangeIndex === valueIndex ? text : item.value))
            ),
          };
        }
        return dataItem;
      }), index
    );
  };

  const isFieldValid = (field, value) => {
    switch (field) {
      case 'lastname':
        return value[0] !== '';
      case 'phone':
        return !!value[0].match(PHONE_REGEX) || !value[0];
      case 'password':
        return value[0].length >= 6;
      case 'confirmedPassword':
        return value[0] === value[1];
      default:
        return true;
    }
  };

  const validData = () => {
    setData(
      data.map(d => ({
        ...d,
        isValid: isFieldValid(d.field, data.map(da => da.value)),
        isValidationAttempted: true,
      })), index
    );
    if (data.every(d => d.isValid)) {
      if (index !== 3) navigation.navigate(`create-account-screen-${index + 1}`);
      else create();
    }
  };

  const render = (
    <ScrollView contentContainerStyle={accountCreationStyles.container} showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps='always'>
      <Text style={accountCreationStyles.title}>{data[0].title}</Text>
      {data.map((d, i) => <View style={accountCreationStyles.input} key={`container${i}`}>
        <NiInput key={`content${i}`} caption={d.caption} value={d.value} type={d.type} optional={!d.required}
          onChangeText={text => onChangeText(text, i)} disabled={isLoading} required={d.required}
          validationMessage={!d.isValid && d.isValidationAttempted ? d.errorMessage : ''} />
      </View>)}
      <View style={accountCreationStyles.footer}>
        {data.map((d, i) => <TouchableOpacity onPress={openUrl} key={`modalText${i}`}>
          {!!d.openUrl && <Text style={styles.modalText}>
            <Text>{d.openUrl.text}</Text>
            <Text style={styles.modalLink}>{d.openUrl.link}</Text>
          </Text>}
        </TouchableOpacity>)}
        <NiPrimaryButton caption="Valider" onPress={validData} loading={isLoading} />
      </View>
    </ScrollView>
  );

  return (
    isIOS
      ? <KeyboardAvoidingView behavior='padding' style={accountCreationStyles.screenView}
        keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS}>
        {render}
      </KeyboardAvoidingView>
      : <View style={accountCreationStyles.screenView}>{render}</View>
  );
};

export default CreateAccountForm;
