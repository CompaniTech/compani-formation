import { View, Text, TouchableOpacity } from 'react-native';
import NiModal from '../Modal';
import styles from './styles';

interface ConfirmationModalProps {
  visible: boolean,
  title: string,
  contentText: string,
  validateButton?: string,
  cancelButton?: string,
  onPressCancelButton: () => void,
  onPressConfirmButton: () => void,
}

const ConfirmationModal = ({
  visible,
  title,
  contentText,
  validateButton = 'Quitter',
  cancelButton = 'Annuler',
  onPressCancelButton,
  onPressConfirmButton,
}: ConfirmationModalProps) => (
  <NiModal visible={visible}>
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.contentText}>{contentText}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={onPressCancelButton}>
          <Text style={styles.buttonText}>{cancelButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressConfirmButton}>
          <Text style={styles.buttonText}>{validateButton}</Text>
        </TouchableOpacity>
      </View>
    </>
  </NiModal>
);

export default ConfirmationModal;
