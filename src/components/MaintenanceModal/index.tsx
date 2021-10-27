import React from 'react';
import { Text } from 'react-native';
import Modal from '../Modal';
import styles from './styles';

const MaintenanceModal = () => (
  <Modal visible={true}>
    <>
      <Text style={styles.title}> L&apos;application est en maintenance !</Text>
      <Text style={styles.body}>Elle sera de nouveau disponible dans quelques minutes.</Text>
    </>
  </Modal>
);

export default MaintenanceModal;
