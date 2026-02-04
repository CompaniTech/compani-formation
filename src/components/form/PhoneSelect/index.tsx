import { Text, View } from 'react-native';
import countryCodes from '../../../core/data/countryCodes';
import NiPicker from '../NiPicker';
import NiInput from '../Input';
import styles from './styles';

interface PhoneSelectProps {
  contact: { phone: string, countryCode: string },
  setContact: (value: string, path: string) => void,
  validationMessage?: string,
}

const PhoneSelect = ({ contact, setContact, validationMessage = '' }: PhoneSelectProps) => (
  <View>
    <Text style={styles.caption}>Téléphone</Text>
    <View style={styles.container}>
      <View>
        <NiPicker value={contact.countryCode} options={countryCodes}
          onValueChange={value => setContact(value, 'countryCode')} />
      </View>
      <View style={styles.input}>
        <NiInput value={contact.phone} onChangeText={value => setContact(value, 'phone')} type="phone" />
      </View>
    </View>
    <Text style={styles.unvalid}>{validationMessage}</Text>
  </View>
);
export default PhoneSelect;
