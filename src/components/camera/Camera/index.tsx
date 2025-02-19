import { useState, useRef } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, CameraCapturedPicture, CameraType, FlashMode } from 'expo-camera';
import { FlipType, manipulateAsync } from 'expo-image-manipulator';
import styles from './styles';
import { ICON } from '../../../styles/metrics';
import { WHITE } from '../../../styles/colors';
import IoniconsButton from '../../icons/IoniconsButton';
import { IS_IOS } from '../../../core/data/constants';

interface NiCameraProps {
  setCapturedImage: (photo: CameraCapturedPicture) => void,
}

const NiCamera = ({ setCapturedImage }: NiCameraProps) => {
  const camera = useRef<CameraView>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [pictureSize, setPictureSize] = useState<string | undefined>();

  const closerValue = (array: number[], value: number) => {
    let tempCloserValue = array[0];
    for (let i = 1; i < array.length; i += 1) {
      if (Math.abs(array[i] - value) < (Math.abs(tempCloserValue - value))) tempCloserValue = array[i];
    }
    return tempCloserValue;
  };

  const setScreenDimension = async () => {
    if (IS_IOS || !camera.current) return;

    const { height, width } = Dimensions.get('window');
    if (!width) return;
    const screenRatio = height / width;
    const supportedSizes = await camera.current.getAvailablePictureSizesAsync();
    const ratiosNumbers = supportedSizes?.filter(supportedSize => !!supportedSize.split('x')[1])
      .map((supportedSize) => {
        const values = supportedSize.split('x');
        return Number(values[0]) / Number(values[1]);
      });

    const index = ratiosNumbers.indexOf(closerValue(ratiosNumbers, screenRatio));
    setPictureSize(supportedSizes[index]);
  };

  const flipPhoto = async (photo: CameraCapturedPicture): Promise<CameraCapturedPicture> =>
    manipulateAsync(photo.uri, [{ flip: FlipType.Horizontal }]);

  const onTakePicture = async () => {
    const photo = await camera.current?.takePictureAsync({ skipProcessing: true });
    if (photo) setCapturedImage(cameraType === 'back' ? photo : await flipPhoto(photo));
  };

  const onHandleCameraType = () => {
    setCameraType(previousCameraType => (previousCameraType === 'back' ? 'front' : 'back'));
    setFlashMode('off');
  };

  const onHandleFlashMode = () => {
    if (cameraType === 'back') setFlashMode(previousFlashMode => (previousFlashMode === 'on' ? 'off' : 'on'));
  };
  return (
    <CameraView ref={camera} facing={cameraType} flash={flashMode} style={styles.camera}
      pictureSize ={pictureSize} onCameraReady={setScreenDimension}>
      <View style={styles.buttons}>
        <IoniconsButton disabled={cameraType === 'front'} onPress={onHandleFlashMode} style={styles.flash} color={WHITE}
          size={ICON.XL} name={flashMode === 'on' ? 'flash' : 'flash-off'}/>
        <TouchableOpacity onPress={onTakePicture} style={styles.takePicture} />
        <IoniconsButton style={styles.cameraType} color={WHITE} size={ICON.XL} onPress={onHandleCameraType}
          name={cameraType === 'front' ? 'camera-reverse' : 'camera'} />
      </View>
    </CameraView>
  );
};

export default NiCamera;
