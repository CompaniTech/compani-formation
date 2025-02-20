import { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PictureType } from '../../types/PictureTypes';
import commonStyle from '../../styles/common';
import { GREY } from '../../styles/colors';
import styles from './styles';
import NiModal from '../Modal';

interface ImagePickerManagerProps {
  savePicture: (image: PictureType) => void,
  onRequestClose: () => void,
  goBack?: () => void,
}

const ImagePickerManager = ({ savePicture, onRequestClose, goBack }: ImagePickerManagerProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const unmount = () => {
    setIsSaving(false);
    onRequestClose();
  };

  const onSavePhoto = async (photo: ImagePicker.ImagePickerAsset) => {
    try {
      setIsSaving(true);

      await savePicture(photo);
      unmount();

      if (goBack) goBack();
    } catch (_) {
      Alert.alert(
        'Echec de l\'enregistrement',
        'Veuillez réessayer',
        [{ text: 'OK', onPress: unmount }],
        { cancelable: false }
      );
    }
  };

  useEffect(() => {
    async function pickImage() {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (result.canceled) unmount();
        else onSavePhoto(result.assets[0]);
      } catch (e) {
        console.error(e);
        Alert.alert(
          'La galerie ne répond pas',
          'Veuillez réessayer',
          [{ text: 'OK', onPress: unmount }],
          { cancelable: false }
        );
      }
    }

    pickImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NiModal visible={isSaving}>
      <View style={styles.loader}>
        <Text style={styles.text}>Enregistrement en cours...</Text>
        <ActivityIndicator style={commonStyle.disabled} color={GREY[300]} size='large' />
      </View>
    </NiModal>
  );
};

export default ImagePickerManager;
