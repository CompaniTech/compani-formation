import { View, Text, Image, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { IS_WEB, TRAINER } from '../../core/data/constants';
import NiPrimaryButton from '../form/PrimaryButton';
import { PINK } from '../../styles/colors';
import styles from './styles';

interface AttendanceEndScreenProps {
  target: string,
  failUpload: boolean,
  goToNextScreen: () => void,
  mode?: string
}

const AttendanceEndScreen = ({ target, failUpload, goToNextScreen, mode = TRAINER }: AttendanceEndScreenProps) => {
  useFocusEffect(
    useCallback(() => {
      const hardwareBackPress = () => {
        goToNextScreen();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

      return () => subscription.remove();
    }, [goToNextScreen])
  );

  const renderFailMessage = (text: string) =>
    <ScrollView contentContainerStyle={styles.errorContainer} showsVerticalScrollIndicator={IS_WEB}>
      <Text style={styles.title}>{text}</Text>
      <MaterialIcons style={styles.icon} size={200} name={'warning'} color={PINK[500]} />
      <Text style={styles.text}>Veuillez réitérer votre demande</Text>
    </ScrollView>;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {mode === TRAINER
        ? <>
          {failUpload
            ? renderFailMessage(
              'Echec de l\'envoi de la demande. Assurez-vous de ne pas émarger des créneaux déjà émargés'
            )
            : <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={IS_WEB}>
              <View>
                <Text style={styles.title}>Une demande d&apos;émargement a été envoyée {target}</Text>
                <Text style={styles.text}>
                Elle est disponible sur la page de la formation sur l&apos;application mobile de l&apos;apprenant
                </Text>
              </View>
              <Image source={require('../../../assets/images/aux_fierte.webp')} style={styles.image} />
              <Text style={styles.text}>
              N&apos;oubliez pas de reporter les émargements dans le tableau prévu à cet effet sur l&apos;application
              web Compani
              </Text>
            </ScrollView>
          }
        </>
        : <>
          {failUpload
            ? renderFailMessage('Echec lors de l\'envoi de votre signature')
            : <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={IS_WEB}>
              <Text style={styles.title}>Merci d&apos;avoir émargé les créneaux</Text>
              <Image source={require('../../../assets/images/aux_fierte.webp')} style={styles.image} />
              <Text style={styles.text}>
                Vous pouvez désormais retourner sur votre formation pour émarger d&apos;autres créneaux ou poursuivre
                votre apprentissage
              </Text>
            </ScrollView>
          }
        </>
      }
      <View style={styles.footer}>
        <NiPrimaryButton caption={'Terminer'} onPress={goToNextScreen} />
      </View>
    </SafeAreaView>
  );
};
export default AttendanceEndScreen;
