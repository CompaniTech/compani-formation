import { Text, View, Image } from 'react-native';
import { formatIdentity, formatPhone } from '../../core/helpers/utils';
import styles from './styles';
import { UserType } from '../../types/UserType';
import { LONG_FIRSTNAME_LONG_LASTNAME } from '../../core/data/constants';

interface PersonCellProps {
  person: UserType,
}

const PersonCell = ({ person }: PersonCellProps) => {
  const name = formatIdentity(person.identity, LONG_FIRSTNAME_LONG_LASTNAME) || '';
  const image = person?.picture?.link || '';
  const email = person?.local?.email || '';
  const contact = person?.contact?.phone ? person.contact : null;
  const source = image ? { uri: image } : require('../../../assets/images/default_avatar.webp');
  const isConnected = person?.firstMobileConnectionDate && 'Connecté(e) à l\'app';

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={source} />
      <View style={styles.text}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        {contact && <Text style={styles.phone}>{formatPhone(contact)}</Text>}
        {isConnected && <Text style={styles.connected}>{isConnected}</Text>}
        {!isConnected && <Text style={styles.code}>Code de connexion: {person?.loginCode}</Text>}
      </View>
    </View>
  );
};

export default PersonCell;
