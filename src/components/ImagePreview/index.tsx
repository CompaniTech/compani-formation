import { useCallback, useEffect, useState } from 'react';
import { View, Alert, BackHandler, Text, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { WebView } from 'react-native-webview';
import { IMAGE, IS_IOS } from '../../core/data/constants';
import { WHITE } from '../../styles/colors';
import { ICON, SCREEN_HEIGHT } from '../../styles/metrics';
import NiImage from '../Image';
import NiPrimaryButton from '../form/PrimaryButton';
import FeatherButton from '../icons/FeatherButton';
import ConfirmationModal from '../ConfirmationModal';
import ZoomImage from '../ZoomImage';
import styles from './styles';

interface sourceProps {
  link: string,
  type: string,
  hasSlots: boolean
}

interface ImagePreviewProps {
  source: sourceProps,
  deleteFile: (shouldDeleteAttendances: boolean) => void,
  onRequestClose: () => void,
  showButton?: boolean,
}

const ImagePreview = ({ source, deleteFile, onRequestClose, showButton = true }: ImagePreviewProps) => {
  const [zoomImage, setZoomImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const { link, type, hasSlots } = source;

  const unmount = useCallback(() => {
    setIsLoading(false);
    onRequestClose();
  }, [onRequestClose]);

  const hardwareBackPress = useCallback(() => {
    unmount();
    return true;
  }, [unmount]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, [hardwareBackPress]);

  const onDeleteFile = async (shouldDeleteAttendances: boolean) => {
    try {
      setIsLoading(true);
      setConfirmationModal(false);
      await deleteFile(shouldDeleteAttendances);
      unmount();
    } catch (_) {
      Alert.alert(
        'Echec de la suppression',
        'Veuillez réessayer',
        [{ text: 'OK', onPress: unmount }],
        { cancelable: false }
      );
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <ConfirmationModal onPressConfirmButton={() => onDeleteFile(true)} visible={confirmationModal}
          title={'Supprimer les émargements'} onPressCancelButton={() => onDeleteFile(false)}
          contentText={'Voulez-vous également supprimer les émargements associés à la feuille d\'émargement ?'}
          cancelButton={'Non'} validateButton={'Oui'} />
        {type === IMAGE
          ? <View style={styles.imageContainer}>
            <NiImage source={{ uri: link }} imgHeight={SCREEN_HEIGHT / 2} onPress={() => setZoomImage(true)} />
          </View>
          : <>
            {IS_IOS
              ? <View style={styles.pdfContainer}>
                <WebView source={{ uri: link }} style={styles.pdfContent} startInLoadingState />
              </View>
              : <TouchableOpacity onPress={() => Print.printAsync({ uri: link })} style={styles.linkContainer}>
                <Text style={styles.linkContent}>
                  Pour visualiser le document veuillez cliquer <Text style={styles.link}>ici</Text>
                </Text>
              </TouchableOpacity>}
          </>}

        <View style={styles.buttonContainer}>
          {showButton && <NiPrimaryButton caption='Supprimer' disabled={isLoading} customStyle={styles.button}
            onPress={() => (hasSlots ? setConfirmationModal(true) : onDeleteFile(false))} loading={isLoading} />}
        </View>
      </View>
      {!zoomImage && <FeatherButton name={'x-circle'} onPress={unmount} size={ICON.LG} color={WHITE}
        disabled={isLoading} style={styles.goBack} />}
      {zoomImage && source && type === IMAGE && <ZoomImage image={{ uri: link }} setZoomImage={setZoomImage} />}
    </View>
  );
};

export default ImagePreview;
