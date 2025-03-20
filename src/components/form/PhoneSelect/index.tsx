import RNPickerSelect from 'react-native-picker-select';
import { Text, View } from 'react-native';
import countryCodes from '../../../core/data/countryCodes';
import NiInput from '../Input';
import styles from './styles';

interface PhoneSelectProps {
  contact: {phone: string, countryCode: string},
  setContact: (value: string, path: string) => void,
  validationMessage?: string,
}

const PhoneSelect = ({ contact, setContact, validationMessage = '' }: PhoneSelectProps) => (
  <>
    <Text style={styles.caption}>Téléphone</Text>
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <RNPickerSelect fixAndroidTouchableBug
          onValueChange={value => setContact(value, 'countryCode')}
          items={countryCodes}
          placeholder={{}}
          value={contact.countryCode}>
          <Text>{countryCodes.find(c => c.value === contact.countryCode)?.inputLabel}</Text>
        </RNPickerSelect>
      </View>
      <View style={styles.input}>
        <NiInput value={contact.phone} onChangeText={value => setContact(value, 'phone')} type="phone" />
      </View>
    </View>
    <Text style={styles.unvalid}>{validationMessage}</Text>
  </>
);
export default PhoneSelect;
