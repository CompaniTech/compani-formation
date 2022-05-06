import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import NiModal from '../Modal';
import FeatherButton from '../icons/FeatherButton';
import { HIT_SLOP, ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';

interface DeletionConfirmationModalProps {
  visible: boolean,
  name: string,
  logout: () => void,
}

const DeletionConfirmationModal = ({
  visible,
  name,
  logout,
}: DeletionConfirmationModalProps) => (
  <NiModal visible={visible}>
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Votre compte a été supprimé</Text>
        <FeatherButton name="x" onPress={logout} size={ICON.MD} color={GREY[600]} />
      </View>
      <Text style={styles.subTitle}>Nous sommes désolé de vous voir partir {name} 😔</Text>
      <Text style={styles.body}>
          Si vous changez d&apos;avis, vous pourrez vous recréer un compte et découvrir notre nouveau contenu
          à tout moment.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity hitSlop={HIT_SLOP} onPress={logout}>
          <Text style={styles.button}>Ok</Text>
        </TouchableOpacity>
      </View>
    </>
  </NiModal>
);
export default DeletionConfirmationModal;
