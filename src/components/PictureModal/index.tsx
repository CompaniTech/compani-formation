import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import NiModal from '../Modal';
import NiPrimaryButton from '../form/PrimaryButton';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';
import { PINK, WHITE } from '../../styles/colors';
import styles from './styles';

interface PictureModalProps {
  visible: boolean,
  canDelete?: boolean,
  closePictureModal: () => void,
  openCamera: () => void,
  openImagePickerManager: () => void,
  deletePicture?: () => void,
}

const PictureModal = ({
  visible,
  canDelete = false,
  closePictureModal,
  openCamera,
  openImagePickerManager,
  deletePicture,
}: PictureModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permission] = Camera.useCameraPermissions();

  const alert = (component: string) => {
    Alert.alert(
      'Accès refusé',
      `Vérifiez que l'application a bien l'autorisation d'accéder à ${component}`,
      [{ text: 'OK' }],
      { cancelable: false }
    );
  };

  const requestPermissionsForCamera = async () => {
    try {
      setIsLoading(true);
      if (permission && permission.granted) openCamera();
      else alert('l\'appareil photo');
    } finally {
      setIsLoading(false);
    }
  };

  const takePicture = () => {
    closePictureModal();
    requestPermissionsForCamera();
  };

  const requestPermissionsForImagePicker = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') openImagePickerManager();
      else alert('la galerie');
    } finally {
      setIsLoading(false);
    }
  };

  const addPictureFromGallery = () => {
    closePictureModal();
    requestPermissionsForImagePicker();
  };

  const onDeletePicture = async () => {
    try {
      setIsLoading(true);
      if (deletePicture) await deletePicture();
    } catch (e) {
      Alert.alert(
        'Echec de la suppression',
        'Réessaie plus tard',
        [{ text: 'OK', onPress: closePictureModal }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NiModal visible={visible} onRequestClose={closePictureModal}>
      <FeatherButton name={'x-circle'} onPress={closePictureModal} size={ICON.LG} color={PINK[500]}
        style={styles.goBack} />
      <NiPrimaryButton caption='Prendre une photo' customStyle={styles.button} onPress={takePicture}
        disabled={isLoading} bgColor={WHITE} color={PINK[500]} />
      <NiPrimaryButton caption='Ajouter une photo' customStyle={styles.button} onPress={addPictureFromGallery}
        disabled={isLoading} bgColor={WHITE} color={PINK[500]} />
      {canDelete &&
        <NiPrimaryButton caption='Supprimer la photo' customStyle={styles.button} onPress={onDeletePicture}
          disabled={isLoading} bgColor={WHITE} color={PINK[500]} loading={isLoading} />}
    </NiModal>);
};

export default PictureModal;
