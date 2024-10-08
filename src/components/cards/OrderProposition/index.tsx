import React, { useState, useEffect, useImperativeHandle } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, LayoutChangeEvent } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { AnswerPositionType } from '../../../types/CardType';
import { GREY, GREEN, ORANGE } from '../../../styles/colors';
import Shadow from '../../design/Shadow';
import styles from './styles';

interface OrderPropositionProps {
  items: AnswerPositionType[],
  index: number,
  isValidated: boolean,
  propsHeight: number[],
  draggedIndex: number | null,
  dragCount: number,
  setAnswersTempPositions: (index: number, positionCount: number) => void,
  onMove: (index: number, tmpToMove: number, orientation: number) => void,
  setPropsHeight: (height: number, index: number) => void,
  setDraggedIndex: (value: number | null) => void,
  setDragCount: (value: number) => void,
}

export interface OrderPropositionRef {
  moveTo: (triggeringPropsRange: number) => void;
}

const OrderProposition = React.forwardRef<OrderPropositionRef, OrderPropositionProps>((
  {
    items,
    index,
    isValidated = false,
    propsHeight,
    draggedIndex,
    dragCount,
    setAnswersTempPositions,
    onMove,
    setPropsHeight,
    setDraggedIndex,
    setDragCount,
  }: OrderPropositionProps,
  ref
) => {
  const translate = useSharedValue({ x: 0, y: 0 });
  const lastOffsetY = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const previousUpShift = useSharedValue(0);
  const previousDownShift = useSharedValue(0);
  const positionCount = useSharedValue(0);

  const [color, setColor] = useState<string>(GREY[200]);
  const [dragButtonColor, setDragButtonColor] = useState<string>(GREY[500]);
  const item = items[index];
  const [isGoodPosition, setIsGoodPosition] = useState<boolean>(item.goodPosition === item.tempPosition);
  const [sumOtherHeights, setSumOtherHeights] = useState<number>(
    propsHeight.filter((_, i) => i !== index).reduce((a, b) => a + b, 0)
  );
  const [allowedPositions, setAllowedPositions] = useState<number[][]>([]);

  useEffect(() => {
    if (dragCount) {
      const expectedOffsetY = allowedPositions[item.tempPosition];
      if (!expectedOffsetY.includes(lastOffsetY.value)) {
        if (expectedOffsetY.length === 1) {
          lastOffsetY.value = expectedOffsetY[0];
          translate.value = withTiming({ x: 0, y: expectedOffsetY[0] }, { duration: 50 });
        } else {
          if (index === 0) {
            const topPropIndex = items.findIndex(i => i.tempPosition === 0);
            lastOffsetY.value = propsHeight[topPropIndex];
            translate.value = withTiming({ x: 0, y: propsHeight[topPropIndex] }, { duration: 50 });
          }
          if (index === 1) {
            const topPropIndex = items.findIndex(i => i.tempPosition === 0);
            const offsetY = topPropIndex === 0 ? 0 : expectedOffsetY[0];
            lastOffsetY.value = offsetY;
            translate.value = withTiming({ x: 0, y: offsetY }, { duration: 50 });
          }
          if (index === 2) {
            const bottomPropIndex = items.findIndex(i => i.tempPosition === 2);
            lastOffsetY.value = -propsHeight[bottomPropIndex];
            translate.value = withTiming({ x: 0, y: -propsHeight[bottomPropIndex] }, { duration: 50 });
          }
        }
      }
    }
  }, [allowedPositions, dragCount, index, item, items, lastOffsetY, propsHeight, sumOtherHeights, translate]);

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

  useEffect(() => {
    const tempSumOtherHeights = propsHeight.filter((_, i) => i !== index).reduce((a, b) => a + b, 0);
    setSumOtherHeights(tempSumOtherHeights);
    const tempAllowedPositions = [
      [[0], [propsHeight[1], propsHeight[2]], [tempSumOtherHeights]],
      [[-propsHeight[0]], [propsHeight[2] - propsHeight[0], 0], [propsHeight[2]]],
      [[-tempSumOtherHeights], [-propsHeight[1], -propsHeight[0]], [0]],
    ];
    setAllowedPositions(tempAllowedPositions[index]);
  }, [index, propsHeight]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setPropsHeight(height, index);
  };

  useImperativeHandle(ref, () => ({
    moveTo(triggeringPropsRange: number) {
      const translateY = lastOffsetY.value + triggeringPropsRange;
      translate.value = { x: 0, y: translateY };
      lastOffsetY.value = translateY;
    },
  }));

  const gesture = Gesture
    .Pan()
    .manualActivation(true)
    .onTouchesMove((_e, state) => {
      if (!isValidated && [index, null].includes(draggedIndex)) {
        state.activate();
      } else {
        state.fail();
      }
    })
    .onBegin(() => {
      zIndex.value = 100;
      runOnJS(setDraggedIndex)(index);
    })
    .onUpdate((event) => {
      if (event.translationY < 0) {
        const maxY = [0, -propsHeight[0], -sumOtherHeights];
        translate.value = {
          x: 0,
          y: Math.max(lastOffsetY.value + event.translationY, maxY[index]),
        };
        const boundedTranslateY = translate.value.y - lastOffsetY.value;
        const adjustedValue = [0, sumOtherHeights / 2, sumOtherHeights].reduce((prev, curr) =>
          (Math.abs(curr + boundedTranslateY) < Math.abs(prev + boundedTranslateY) ? curr : prev));
        const shift = adjustedValue / (sumOtherHeights / 2);
        if (shift === 0) {
          positionCount.value = 0;
          if (previousUpShift.value === 1) {
            runOnJS(onMove)(index, item.tempPosition - 1, -1);
            previousUpShift.value = 0;
          }
        }
        if (shift === 1) {
          positionCount.value = -1;
          if (previousUpShift.value === 2) {
            runOnJS(onMove)(index, 0, -1);
            previousUpShift.value = 1;
          } else if (previousUpShift.value === 0) {
            runOnJS(onMove)(index, item.tempPosition - 1, 1);
            previousUpShift.value = 1;
          }
        }
        if (shift === 2 && previousUpShift.value !== 2) {
          positionCount.value = -2;
          if (previousUpShift.value === 0) runOnJS(onMove)(index, item.tempPosition - 1, 1);
          runOnJS(onMove)(index, item.tempPosition - 2, 1);
          previousUpShift.value = 2;
        }
      } else if (event.translationY > 0) {
        const maxY = [sumOtherHeights, propsHeight[2], 0];
        translate.value = {
          x: 0,
          y: Math.min(lastOffsetY.value + event.translationY, maxY[index]),
        };
        const boundedTranslateY = translate.value.y - lastOffsetY.value;
        const adjustedValue = [0, sumOtherHeights / 2, sumOtherHeights].reduce((prev, curr) =>
          (Math.abs(curr - boundedTranslateY) < Math.abs(prev - boundedTranslateY) ? curr : prev));
        const shift = adjustedValue / (sumOtherHeights / 2);
        if (shift === 0) {
          positionCount.value = 0;
          if (previousDownShift.value === 1) {
            runOnJS(onMove)(index, item.tempPosition + 1, 1);
            previousDownShift.value = 0;
          }
        }
        if (shift === 1) {
          positionCount.value = 1;
          if (previousDownShift.value === 2) {
            runOnJS(onMove)(index, 2, 1);
            previousDownShift.value = 1;
          } else if (previousDownShift.value === 0) {
            runOnJS(onMove)(index, item.tempPosition + 1, -1);
            previousDownShift.value = 1;
          }
        }
        if (shift === 2 && previousDownShift.value !== 2) {
          positionCount.value = 2;
          if (previousDownShift.value === 0)runOnJS(onMove)(index, item.tempPosition + 1, -1);
          runOnJS(onMove)(index, item.tempPosition + 2, -1);
          previousDownShift.value = 2;
        }
      }
    })
    .onEnd(() => {
      if (positionCount.value < 0) {
        const abovePropIndex = items.findIndex(i => i.tempPosition === item.tempPosition - 1);

        const value = Math.abs(positionCount.value) === 1 ? -propsHeight[abovePropIndex] || 0 : -sumOtherHeights;
        translate.value = { x: 0, y: lastOffsetY.value + value };
        lastOffsetY.value += value;
        runOnJS(setAnswersTempPositions)(index, positionCount.value);
      } else if (positionCount.value > 0) {
        const bottom = items.findIndex(i => i.tempPosition === item.tempPosition + 1);

        const value = positionCount.value === 1 ? propsHeight[bottom] || 0 : sumOtherHeights;
        translate.value = { x: 0, y: lastOffsetY.value + value };
        lastOffsetY.value += value;
        runOnJS(setAnswersTempPositions)(index, positionCount.value);
      } else {
        translate.value = { x: 0, y: lastOffsetY.value };
      }
      zIndex.value = 0;
      previousUpShift.value = 0;
      previousDownShift.value = 0;
      runOnJS(setDragCount)(dragCount + 1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translate.value.x }, { translateY: translate.value.y }],
    zIndex: zIndex.value,
  }));

  const style = styles(color, isValidated);

  return (
    <GestureDetector gesture={gesture} touchAction={'pan-y'}>
      <Animated.View style={[animatedStyle]} onLayout={handleLayout}>
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
