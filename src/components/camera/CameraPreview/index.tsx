import { CameraCapturedPicture } from 'expo-camera';
import { View, ImageBackground } from 'react-native';
import NiPrimaryButton from '../../form/PrimaryButton';
import NiSecondaryButton from '../../form/SecondaryButton';
import styles from './style';

interface NiCameraPreviewProps {
  photo: CameraCapturedPicture,
  loading: boolean,
  onSavePhoto: (photo: CameraCapturedPicture) => void,
  onRetakePicture: () => void,
}

const NiCameraPreview = ({ photo, loading, onSavePhoto, onRetakePicture }: NiCameraPreviewProps) => (
  <View style={styles.container}>
    <ImageBackground source={{ uri: photo && photo.uri }} style={styles.photo}>
      <View style={styles.buttonContainer}>
        <NiPrimaryButton caption='Enregistrer la photo' onPress={() => onSavePhoto(photo)} loading={loading}
          disabled={loading} customStyle={styles.button} />
        <NiSecondaryButton caption='Reprendre la photo' onPress={onRetakePicture} disabled={loading}
          customStyle={styles.button} />
      </View>
    </ImageBackground>
  </View>
);

export default NiCameraPreview;
