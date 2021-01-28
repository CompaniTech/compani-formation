import React from 'react';
import { ScrollView, View, Modal } from 'react-native';
import { TRANSPARENT_GRADIENT, WHITE } from '../../styles/colors';
import { INPUT_HEIGHT } from '../../styles/metrics';
import FooterGradient from '../design/FooterGradient';
import styles from './styles';

interface UpdateAppModalProps {
  visible: boolean,
  onRequestClose: () => void,
  children?: any,
}

const ModalContainer = ({ visible, onRequestClose, children }: UpdateAppModalProps) => (
  <Modal transparent={true} onRequestClose={onRequestClose} visible={visible}>
    <ScrollView contentContainerStyle={styles.modalContainer}>
      <View style={styles.modalContent}>
        {children}
      </View>
    </ScrollView>
    <FooterGradient colors={[TRANSPARENT_GRADIENT, WHITE]} bottomPosition={0} height={2 * INPUT_HEIGHT}/>
  </Modal>
);

export default ModalContainer;
