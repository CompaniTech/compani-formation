import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { WHITE } from '../../styles/colors';
import { ICON } from '../../styles/metrics';
import FeatherButton from '../icons/FeatherButton';
import cardsStyle from '../../styles/cards';
import styles from './styles';

interface ZoomImageProps {
  image: { uri: string },
  setZoomImage: (value: boolean) => void,
}

const ZoomImage = ({ image, setZoomImage }: ZoomImageProps) => {
  const baseScale = useSharedValue(1);
  const lastScale = useSharedValue(1);
  const translate = useSharedValue({ x: 0, y: 0 });
  const imageLastOffset = useSharedValue({ x: 0, y: 0 });

  const pinchHandler = Gesture.Pinch().onUpdate((event) => { baseScale.value = lastScale.value * event.scale; });

  const panHandler = Gesture
    .Pan()
    .onUpdate((event) => {
      translate.value = {
        x: imageLastOffset.value.x + event.translationX,
        y: imageLastOffset.value.y + event.translationY,
      };
    })
    .onEnd(() => { imageLastOffset.value = { x: translate.value.x, y: translate.value.y }; });

  const composed = Gesture.Race(pinchHandler, panHandler);

  const transform = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value.x }, { translateY: translate.value.y }, { scale: baseScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <FeatherButton name='x-circle' onPress={() => setZoomImage(false)} size={ICON.LG} color={WHITE}
        style={styles.goBack} />
      <GestureDetector gesture={composed}>
        <Animated.Image source={image} style={[cardsStyle.media, styles.media, transform]} />
      </GestureDetector>
    </SafeAreaView>);
};

export default ZoomImage;
