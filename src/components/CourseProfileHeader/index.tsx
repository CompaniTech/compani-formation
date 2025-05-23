import { View, Text, ImageBackground, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FeatherButton from '../icons/FeatherButton';
import { WHITE } from '../../styles/colors';
import { ICON } from '../../styles/metrics';
import styles from './styles';

interface CourseProfileHeaderProps {
  source:ImageSourcePropType,
  goBack: () => void,
  title: string,
}

const CourseProfileHeader = ({
  source,
  goBack,
  title,
}: CourseProfileHeaderProps) => (
  <ImageBackground source={source} imageStyle={styles.image}>
    <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.4)']} style={styles.gradient} />
    <View style={styles.header}>
      <FeatherButton style={styles.arrow} onPress={goBack} name="arrow-left" color={WHITE} size={ICON.MD}
        iconStyle={styles.arrowShadow} />
      <Text style={styles.title} numberOfLines={4}>{title}</Text>
    </View>
  </ImageBackground>
);

export default CourseProfileHeader;
