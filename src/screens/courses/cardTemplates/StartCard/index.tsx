import { View, Text, Image, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NiPrimaryButton from '../../../../components/form/PrimaryButton';
import { PINK, WHITE } from '../../../../styles/colors';
import { EDGES } from '../../../../styles/metrics';
import CardHeader from '../../../../components/cards/CardHeader';
import styles from './styles';

interface StartCardProps {
  title: string,
  isLoading: boolean,
  goBack: () => void,
  startTimer?: () => void,
}

const StartCard = ({ title, isLoading, goBack, startTimer }: StartCardProps) => {
  const navigation = useNavigation();

  const onPress = () => {
    if (startTimer) startTimer();
    navigation.navigate('card-0');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <CardHeader color={WHITE} onPress={goBack} icon='arrow-left' />
        <View style={styles.wrapper}>
          <View>
            <ImageBackground imageStyle={{ resizeMode: 'contain' }} style={styles.imageBackground}
              source={require('../../../../../assets/images/start_card_background.webp')}>
              <Image source={require('../../../../../assets/images/doct_liste.webp')} style={styles.image} />
            </ImageBackground>
            {isLoading
              ? <ActivityIndicator style={styles.loader} color={WHITE} size="large" />
              : <Text style={styles.text}>{title}</Text>}
          </View>
          {!isLoading && <NiPrimaryButton customStyle={styles.button} bgColor={WHITE} color={PINK[500]}
            caption="Démarrer" onPress={onPress} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StartCard;
