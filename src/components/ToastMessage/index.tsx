import { useCallback, useEffect, useRef } from 'react';
import { Text, View, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { WHITE } from '../../styles/colors';
import { IS_WEB } from '../../core/data/constants';
import styles, { TOAST_OFFSET } from './styles';

interface ToastMessageProps {
  message: string,
  onFinish: (finished: boolean) => void,
}
const ToastMessage = ({ message, onFinish }: ToastMessageProps) => {
  const translation = useRef(new Animated.Value(TOAST_OFFSET)).current;

  const pop = useCallback(() => {
    Animated.sequence([
      Animated.timing(translation, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: !IS_WEB,
      }),
      Animated.timing(translation, {
        toValue: TOAST_OFFSET,
        delay: 2500,
        duration: 1200,
        useNativeDriver: !IS_WEB,
      }),
    ]).start(({ finished }) => onFinish(finished));
  }, [onFinish, translation]);

  useEffect(() => { pop(); }, [pop]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: translation }] }]}>
      <View style={styles.content}>
        <AntDesign name={'close-circle'} size={24} color={WHITE} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default ToastMessage;
