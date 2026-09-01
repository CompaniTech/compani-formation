import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { GREY } from '../../../styles/colors';
import { ICON } from '../../../styles/metrics';
import NiModal from '../../Modal';
import styles from './styles';

interface ValidationModalProps {
  visible: boolean,
  companyName: string,
  onPressCancelButton: () => void,
  onPressConfirmButton: () => void,
}

const ValidationModal = ({ visible, companyName, onPressCancelButton, onPressConfirmButton }: ValidationModalProps) => (
  <NiModal visible={visible}>
    <View style={styles.container}>
      <Text style={styles.title}>Voulez-vous vraiment ajouter cette structure ?</Text>
      <View style={styles.companyContainer}>
        <Feather name={'home'} size={ICON.MD} color={GREY[600]} />
        <Text style={styles.companyName}>{companyName}</Text>
      </View>
      <Text style={styles.contentText}>
        En l’ajoutant, vous confirmez que cette structure est votre employeur.
        Elle aura alors accès à votre historique de formation sur Compani.
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={onPressCancelButton}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressConfirmButton}>
          <Text style={styles.buttonText}>Ajouter la structure</Text>
        </TouchableOpacity>
      </View>
    </View>
  </NiModal>
);

export default ValidationModal;
