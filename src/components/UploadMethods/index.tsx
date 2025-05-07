import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { GREY, PINK } from '../../styles/colors';
import { INTER_B2B, SINGLE, CAMERA, GALLERY } from '../../core/data/constants';
import AttendanceSheets from '../../api/attendanceSheets';
import styles from './styles';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import ImagePickerManager from '../../components/ImagePickerManager';
import { useGetLoggedUserId } from '../../store/main/hooks';
import { formatImage, formatPayload } from '../../core/helpers/pictures';
import { CourseType } from '../../types/CourseTypes';
import FeatherButton from '../icons/FeatherButton';
import { ICON } from '../../styles/metrics';

interface UploadMethodsProps {
  attendanceSheetToAdd: string,
  slotsToAdd: string[],
  course: CourseType,
  goToParent: () => void,
}

const UploadMethods = ({ attendanceSheetToAdd, slotsToAdd = [], course, goToParent }: UploadMethodsProps) => {
  const navigation = useNavigation();
  const loggedUserId = useGetLoggedUserId();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>('');
  const [imagePickerManager, setImagePickerManager] = useState<boolean>(false);
  const [isSingle, setIsSingle] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    setIsSingle(course.type === SINGLE);
  }, [course]);

  const hardwareBackPress = useCallback(() => {
    if (isFocused) navigation.goBack();
    return true;
  }, [navigation, isFocused]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  }, [hardwareBackPress]);

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
      const { granted } = await requestPermission();
      if (granted) {
        setType(CAMERA);
        setImagePickerManager(true);
      } else alert('l\'appareil photo');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissionsForImagePicker = async () => {
    try {
      setIsLoading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        setType(GALLERY);
        setImagePickerManager(true);
      } else alert('la galerie');
    } finally {
      setIsLoading(false);
    }
  };

  const savePicture = async (picture: ImagePicker.ImagePickerAsset) => {
    try {
      if (course) {
        const file = await formatImage(picture, `emargement-${attendanceSheetToAdd}`);
        const data = formatPayload({
          file,
          course: course._id,
          trainer: loggedUserId,
          ...(
            [INTER_B2B, SINGLE].includes(course.type)
              ? { trainee: attendanceSheetToAdd }
              : { date: attendanceSheetToAdd }
          ),
          ...(isSingle && { slots: slotsToAdd }),
        });
        await AttendanceSheets.upload(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      goToParent();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <FeatherButton name='arrow-left' onPress={navigation.goBack} size={ICON.MD} color={GREY[600]} />
      </View>
      <View style={styles.container}>
        <NiPrimaryButton caption='Prendre une photo' customStyle={styles.button} onPress={requestPermissionsForCamera}
          disabled={isLoading} bgColor={GREY[100]} color={PINK[500]} />
        <NiPrimaryButton caption='Ajouter une photo' customStyle={styles.button} disabled={isLoading} color={PINK[500]}
          onPress={requestPermissionsForImagePicker} bgColor={GREY[100]} />
        {isSingle && <NiPrimaryButton caption='Ajouter une signature' customStyle={styles.button} disabled={isLoading}
          color={PINK[500]} onPress={() => navigation.navigate('attendance-signature')} bgColor={GREY[100]} />}
      </View>
      {imagePickerManager && <ImagePickerManager type={type} onRequestClose={() => setImagePickerManager(false)}
        savePicture={savePicture} />}
    </SafeAreaView>

  );
};

export default UploadMethods;
