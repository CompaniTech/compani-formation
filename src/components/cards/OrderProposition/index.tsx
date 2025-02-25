import React, { useState, useEffect, useImperativeHandle } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, LayoutChangeEvent } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AnswerPositionType } from '../../../types/CardType';
import { GREY, GREEN, ORANGE } from '../../../styles/colors';
import Shadow from '../../design/Shadow';
import styles from './styles';

const DOWN = 'down';
const UP = 'up';

interface OrderPropositionProps {
  items: AnswerPositionType[],
  index: number,
  isValidated: boolean,
  propsHeight: number[],
  draggedIndex: number | null,
  dragCount: number,
  allowedOffsetY: number[][],
  sumOtherHeights: number,
  setAnswersTempPositions: (index: number, positionCount: number) => void,
  onMove: (index: number, tmpToMove: number, orientation: string) => void,
  setHeight: (height: number, index: number) => void,
  setDraggedIndex: (value: number | null) => void,
  setDragCount: (value: number) => void,
}

export interface OrderPropositionRef {
  moveTo: (triggeringPropsHeight: number, orientation: string) => void;
}

const OrderProposition = React.forwardRef<OrderPropositionRef, OrderPropositionProps>((
  {
    items,
    index,
    isValidated = false,
    propsHeight,
    draggedIndex,
    dragCount,
    allowedOffsetY,
    sumOtherHeights,
    setAnswersTempPositions,
    onMove,
    setHeight,
    setDraggedIndex,
    setDragCount,
  }: OrderPropositionProps,
  ref
) => {
  const translateY = useSharedValue(0);
  const globalOffsetY = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const previousUpShift = useSharedValue(0);
  const previousDownShift = useSharedValue(0);
  const positionCount = useSharedValue(0);

  const [color, setColor] = useState<string>(GREY[200]);
  const [dragButtonColor, setDragButtonColor] = useState<string>(GREY[500]);
  const item = items[index];
  const [isGoodPosition, setIsGoodPosition] = useState<boolean>(item.goodPosition === item.tempPosition);

  useEffect(() => { setIsGoodPosition(item.goodPosition === item.tempPosition); }, [item]);

  useEffect(() => { // this useEffect handles a bug case where items are not positioned as they should be
    if (dragCount) {
      const expectedOffsetY = allowedOffsetY[item.tempPosition];
      if (!expectedOffsetY.includes(globalOffsetY.value)) {
        if (expectedOffsetY.length === 1) {
          globalOffsetY.value = expectedOffsetY[0];
          translateY.value = withTiming(expectedOffsetY[0], { duration: 50 });
        } else {
          if (index === 0) {
            const topPropIndex = items.findIndex(i => i.tempPosition === 0);
            globalOffsetY.value = propsHeight[topPropIndex];
            translateY.value = withTiming(propsHeight[topPropIndex], { duration: 50 });
          }
          if (index === 1) {
            const topPropIndex = items.findIndex(i => i.tempPosition === 0);
            const offsetY = topPropIndex === 0 ? 0 : expectedOffsetY[0];
            globalOffsetY.value = offsetY;
            translateY.value = withTiming(offsetY, { duration: 50 });
          }
          if (index === 2) {
            const bottomPropIndex = items.findIndex(i => i.tempPosition === 2);
            globalOffsetY.value = -propsHeight[bottomPropIndex];
            translateY.value = withTiming(-propsHeight[bottomPropIndex], { duration: 50 });
          }
        }
      }
    }
  }, [allowedOffsetY, dragCount, index, item, items, globalOffsetY, propsHeight, sumOtherHeights, translateY]);

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

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height, index);
  };

  useImperativeHandle(ref, () => ({
    moveTo(triggeringPropsHeight: number, orientation: string) {
      const translate = orientation === DOWN
        ? globalOffsetY.value + triggeringPropsHeight
        : globalOffsetY.value - triggeringPropsHeight;
      translateY.value = translate;
      globalOffsetY.value = translate;
    },
  }));

  const gesture = Gesture
    .Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (!isValidated && [index, null].includes(draggedIndex)) state.activate();
      else state.fail();
    })
    .onBegin(() => {
      zIndex.value = 100;
      runOnJS(setDraggedIndex)(index);
    })
    .onUpdate((event) => {
      if (event.translationY < 0) { // item is going up
        // max translation to the top each proposition can do based on its index
        const maxUpwardTranslationByIndex = [0, -propsHeight[0], -sumOtherHeights];
        translateY.value = Math.max(globalOffsetY.value + event.translationY, maxUpwardTranslationByIndex[index]);
        const boundedTranslateY = translateY.value - globalOffsetY.value;
        // These are the 3 values that the translation can approximately take
        const adjustedValue = [0, sumOtherHeights / 2, sumOtherHeights].reduce((prev, curr) =>
          (Math.abs(curr + boundedTranslateY) < Math.abs(prev + boundedTranslateY) ? curr : prev));
        const shift = adjustedValue / (sumOtherHeights / 2);
        positionCount.value = -shift;

        if (shift === 0) {
          if (previousUpShift.value === 1) {
            runOnJS(onMove)(index, item.tempPosition - 1, UP);
            previousUpShift.value = 0;
          }
        }
        if (shift === 1) {
          if (previousUpShift.value === 2) {
            runOnJS(onMove)(index, 0, UP);
            previousUpShift.value = 1;
          } else if (previousUpShift.value === 0) {
            runOnJS(onMove)(index, item.tempPosition - 1, DOWN);
            previousUpShift.value = 1;
          }
        }
        if (shift === 2 && previousUpShift.value !== 2) {
          if (previousUpShift.value === 0) runOnJS(onMove)(index, item.tempPosition - 1, DOWN);
          runOnJS(onMove)(index, item.tempPosition - 2, DOWN);
          previousUpShift.value = 2;
        }
      } else if (event.translationY > 0) { // item is going down
        // max translation to the bottom each proposition can do based on its index
        const maxDownwardTranslationByIndex = [sumOtherHeights, propsHeight[2], 0];
        translateY.value = Math.min(globalOffsetY.value + event.translationY, maxDownwardTranslationByIndex[index]);
        const boundedTranslateY = translateY.value - globalOffsetY.value;
        const adjustedValue = [0, sumOtherHeights / 2, sumOtherHeights].reduce((prev, curr) =>
          (Math.abs(curr - boundedTranslateY) < Math.abs(prev - boundedTranslateY) ? curr : prev));
        const shift = adjustedValue / (sumOtherHeights / 2);
        positionCount.value = shift;

        if (shift === 0) {
          if (previousDownShift.value === 1) {
            runOnJS(onMove)(index, item.tempPosition + 1, DOWN);
            previousDownShift.value = 0;
          }
        }
        if (shift === 1) {
          if (previousDownShift.value === 2) {
            runOnJS(onMove)(index, 2, DOWN);
            previousDownShift.value = 1;
          } else if (previousDownShift.value === 0) {
            runOnJS(onMove)(index, item.tempPosition + 1, UP);
            previousDownShift.value = 1;
          }
        }
        if (shift === 2 && previousDownShift.value !== 2) {
          if (previousDownShift.value === 0)runOnJS(onMove)(index, item.tempPosition + 1, UP);
          runOnJS(onMove)(index, item.tempPosition + 2, UP);
          previousDownShift.value = 2;
        }
      }
    })
    .onEnd(() => {
      if (positionCount.value < 0) { // item is going up
        const abovePropIndex = items.findIndex(i => i.tempPosition === item.tempPosition - 1);

        const value = positionCount.value === -1 ? -propsHeight[abovePropIndex] || 0 : -sumOtherHeights;
        translateY.value = globalOffsetY.value + value;
        globalOffsetY.value += value;
        runOnJS(setAnswersTempPositions)(index, positionCount.value);
      } else if (positionCount.value > 0) { // item is going down
        const bottomPropIndex = items.findIndex(i => i.tempPosition === item.tempPosition + 1);

        const value = positionCount.value === 1 ? propsHeight[bottomPropIndex] || 0 : sumOtherHeights;
        translateY.value = globalOffsetY.value + value;
        globalOffsetY.value += value;
        runOnJS(setAnswersTempPositions)(index, positionCount.value);
      } else { // item position doesn't change
        translateY.value = globalOffsetY.value;
      }
      zIndex.value = 0;
      previousUpShift.value = 0;
      previousDownShift.value = 0;
      runOnJS(setDragCount)(dragCount + 1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: zIndex.value,
  }));

  const style = styles(color, isValidated);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle} onLayout={handleLayout}>
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
});

export default OrderProposition;
