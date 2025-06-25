import { View, Modal, KeyboardAvoidingView } from 'react-native';
import { IS_IOS } from '../../core/data/constants';
import styles from './styles';

interface NiModalProps {
  visible: boolean,
  children: any,
  onRequestClose?: () => void,
}

const NiModal = ({ visible, children, onRequestClose }: NiModalProps) => (
  <Modal visible={visible} transparent={true} onRequestClose={onRequestClose} animationType='fade'>
    <KeyboardAvoidingView style={styles.modalContainer} behavior={IS_IOS ? 'padding' : 'height' }>
      <View style={styles.modalContent}>
        {children}
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

export default NiModal;
