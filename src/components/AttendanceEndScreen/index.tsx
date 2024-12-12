import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import NiPrimaryButton from '../form/PrimaryButton';
import { PINK } from '../../styles/colors';

interface AttendanceEndScreenProps {
  traineeName: string,
  failUpload: boolean,
  goToNextScreen: () => void,
}

const AttendanceEndScreen = ({ traineeName, failUpload, goToNextScreen }: AttendanceEndScreenProps) => (
  <SafeAreaView style={styles.safeArea} edges={['top']}>
    {failUpload
      ? <View style={styles.errorContainer}>
        <Text style={styles.title}>Echec de l&apos;envoi de la demande à {traineeName}</Text>
        <MaterialIcons style={styles.icon} size={200} name={'warning'} color={PINK[500]} />
        <Text style={styles.text}>Veuillez réitérer votre demande</Text>
      </View>
      : <>
        <View style={styles.upperContainer}>
          <Text style={styles.title}>Une demande d&apos;émargement a été envoyée à {traineeName}</Text>
        </View>
        <Text style={styles.text}>Elle est disponible sur la page de la formation sur son application mobile</Text>
        <Image source={require('../../../assets/images/aux_fierte.webp')} style={styles.image} />
        <Text style={styles.text}>
            N&apos;oubliez pas de reporter les émargements dans le tableau prévu à cet effet sur l&apos;application
            web Compani
        </Text>
      </>
    }
    <View style={styles.footer}>
      <NiPrimaryButton caption={'Terminer'} onPress={goToNextScreen} />
    </View>
  </SafeAreaView>
);
export default AttendanceEndScreen;
