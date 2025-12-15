import { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardHeader from '../../../../components/cards/CardHeader';
import CardFooter from '../../../../components/cards/CardFooter';
import AnimatedShadow from '../../../../components/design/AnimatedShadow';
import {
  useGetCard,
  useGetCardIndex,
  useSetViewedFlashCards,
  useGetViewedFlashCards,
} from '../../../../store/cards/hooks';
import { IS_WEB } from '../../../../core/data/constants';
import { FlashCardType } from '../../../../types/CardType';
import styles from './styles';

interface FlashCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

export enum ClickOnCard {
  UNCLICKED_CARD = 'unclicked',
  CLICKED_ONCE_CARD = 'clickedOnce',
  CLICKED_MORE_THAN_ONCE_CARD = 'clickedMoreThanOnce',
}

const FlashCard = ({ isLoading, setIsRightSwipeEnabled }: FlashCardProps) => {
  const card: FlashCardType = useGetCard();
  const index = useGetCardIndex();
  const viewedFlashCards = useGetViewedFlashCards();
  const hasCardBeenViewed = viewedFlashCards.includes(card?._id);
  const setViewedFlashCards = useSetViewedFlashCards();
  const [timesHasBeenClicked, setTimesHasBeenClicked] = useState<ClickOnCard>(ClickOnCard.UNCLICKED_CARD);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [hasBeenClicked, setHasBeenClicked] = useState<boolean>(false);
  let rotationValue = 0;
  animatedValue.addListener(({ value }) => { rotationValue = value; });

  useEffect(() => {
    setHasBeenClicked(hasCardBeenViewed);
    setIsRightSwipeEnabled(hasCardBeenViewed);
  }, [hasCardBeenViewed, setIsRightSwipeEnabled]);

  if (isLoading) return null;

  const flipCard = () => {
    if (timesHasBeenClicked === ClickOnCard.UNCLICKED_CARD) {
      setTimesHasBeenClicked(ClickOnCard.CLICKED_ONCE_CARD);
      if (!hasCardBeenViewed) setViewedFlashCards(card._id);
    }
    Animated.spring(animatedValue, {
      toValue: rotationValue >= 90 ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: !IS_WEB,
    }).start();
  };

  const frontInterpolate = animatedValue.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate = animatedValue.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  const style = styles(card);

  return (
    <SafeAreaView style={style.safeArea}>
      <CardHeader />
      <ScrollView contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
        <View style={style.container}>
          <TouchableOpacity style={style.contentContainer} onPress={flipCard}>
            <Animated.View style={[style.flipCard, frontAnimatedStyle]}>
              <Text style={style.questionWatermark}>?</Text>
              <Text style={style.question}>{card.text}</Text>
            </Animated.View>
            <Animated.View style={[style.flipCard, style.flipCardBack, backAnimatedStyle]}>
              <Text style={style.answerWatermark}>!</Text>
              <Text style={style.answer}>{card.backText}</Text>
            </Animated.View>
            <AnimatedShadow customStyle={[style.shadow, frontAnimatedStyle]} />
          </TouchableOpacity>
        </View>
        <CardFooter index={index} removeRight={!hasBeenClicked} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FlashCard;
