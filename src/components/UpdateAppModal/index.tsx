import { Text, Linking } from 'react-native';
import NiModal from '../Modal';
import NiPrimaryButton from '../form/PrimaryButton';
import styles from './styles';
import { IS_IOS } from '../../core/data/constants';

const ANDROID_STORE_WEB_URL = 'https://play.google.com/store/apps/details?id=com.alenvi.compani';

const UpdateAppModal = () => {
  const appUrl = IS_IOS ? 'https://apps.apple.com/app/id/1516691161' : 'market://details?id=com.alenvi.compani';

  const onPressUpdate = async () => {
    try {
      await Linking.openURL(appUrl);
    } catch (_) {
      if (!IS_IOS) {
        try {
          await Linking.openURL(ANDROID_STORE_WEB_URL);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  return (
    <NiModal visible={true}>
      <Text style={styles.title}>Nouvelle version de l&apos;app disponible !</Text>
      <Text style={styles.contentText}>
        Merci de mettre à jour votre application pour pouvoir continuer à l&apos;utiliser :)
      </Text>
      <NiPrimaryButton customStyle={styles.button} caption="Mettre à jour" onPress={onPressUpdate} />
    </NiModal>
  );
};

export default UpdateAppModal;
