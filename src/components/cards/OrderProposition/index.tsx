import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GREY, GREEN, ORANGE } from '../../../styles/colors';
import Shadow from '../../design/Shadow';
import styles from './styles';
import { MARGIN, ORDERED_ANSWER_MIN_HEIGHT } from '../../../styles/metrics';

interface OrderPropositionProps {
  item: {
    label: string,
    goodPosition: number,
    tempPosition: number
  },
  index: number,
  isValidated: boolean,
  onDragUp: (index: number, positionCount: number) => void,
  onDragDown: (index: number, positionCount: number) => void
  onMoveUp: (index: number, indexToMove: number) => void,
  onMoveDown: (index: number, indexToMove: number) => void,
}

const OrderProposition = ({
  item,
  index,
  isValidated = false,
  onDragUp,
  onDragDown,
  onMoveUp,
  onMoveDown,
}: OrderPropositionProps) => {
  const translate = useSharedValue({ x: 0, y: 0 });
  const lastOffsetY = useSharedValue(0);
  const zIndex = useSharedValue(0);

  const possibleDragRanges = [
    [0, ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD, 160],
    [0, -(ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD), ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD],
    [0, -(ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD), -160],
  ];

  const [color, setColor] = useState<string>(GREY[200]);
  const [dragButtonColor, setDragButtonColor] = useState<string>(GREY[500]);
  const [isGoodPosition, setIsGoodPosition] = useState<boolean>(item.goodPosition === item.tempPosition);

  useEffect(() => {
    if (isGoodPosition && isValidated) {
      setDragButtonColor(GREEN[800]);
      return setColor(GREEN[600]);
    }
    if (!isGoodPosition && isValidated) {
      setDragButtonColor(ORANGE[800]);
      return setColor(ORANGE[600]);
    }

    setDragButtonColor(GREY[500]);
    return setColor(GREY[500]);
  }, [isGoodPosition, isValidated]);

  useEffect(() => {
    setIsGoodPosition(item.goodPosition === item.tempPosition);
  }, [item]);

  const gesture = Gesture
    .Pan()
    .onBegin(() => {
      zIndex.value = 100;
    })
    .onUpdate((event) => {
      if (isValidated) return;

      if (event.translationY < 0) {
        const maxY = [0, -(ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD), -160];
        translate.value = {
          x: 0,
          y: Math.max(lastOffsetY.value + event.translationY, maxY[index]),
        };
        const value = possibleDragRanges[index].reduce((prev, curr) =>
          (Math.abs(curr - translate.value.y) < Math.abs(prev - translate.value.y) ? curr : prev));
        const indexToMove = index - (Math.abs(value) / (ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD));
        runOnJS(onMoveUp)(index, indexToMove);
      } else {
        const maxY = [160, ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD, 0];
        translate.value = {
          x: 0,
          y: Math.min(lastOffsetY.value + event.translationY, maxY[index]),
        };
        const value = possibleDragRanges[index].reduce((prev, curr) =>
          (Math.abs(curr - translate.value.y) < Math.abs(prev - translate.value.y) ? curr : prev));
        const indexToMove = index + (Math.abs(value) / (ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD));
        runOnJS(onMoveDown)(index, indexToMove);
      }
    })
    .onEnd((event) => {
      if (isValidated) return;
      const positionCount = Math.round((event.translationY) / (ORDERED_ANSWER_MIN_HEIGHT + MARGIN.MD));
      if (Math.abs(positionCount)) {
        if (positionCount < 0) runOnJS(onDragUp)(index, Math.abs(positionCount));
        if (positionCount > 0) runOnJS(onDragDown)(index, Math.abs(positionCount));
      }
      const value = possibleDragRanges[index].reduce((prev, curr) =>
        (Math.abs(curr - translate.value.y) < Math.abs(prev - translate.value.y) ? curr : prev));
      translate.value = { x: 0, y: value };
      lastOffsetY.value = value;
      zIndex.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value.x }, { translateY: translate.value.y }],
    zIndex: zIndex.value,
  }));

  const style = styles(color, isValidated);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle]}>
        <View style={style.container}>
          <View style={style.contentContainer}>
            <TouchableOpacity style={style.indexContainer} disabled={isValidated} delayLongPress={0}
              activeOpacity={1}>
              <View style={style.index}>
                <MaterialCommunityIcons name="drag" size={30} color={dragButtonColor} />
                <Text style={style.indexText}>{item.tempPosition + 1}</Text>
              </View>
              <Shadow customStyle={style.indexShadow} />
            </TouchableOpacity>
            <TouchableOpacity style={style.answerContainer} disabled={isValidated} delayLongPress={100}>
              <View style={style.answer}>
                <Text style={style.answerText}>{item.label}</Text>
              </View>
              <Shadow customStyle={style.answerShadow} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default OrderProposition;
