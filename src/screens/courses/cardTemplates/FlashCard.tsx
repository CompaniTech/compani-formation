import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { connect } from 'react-redux';
import { StateType } from '../../../types/store/StoreType';
import { getCard } from '../../../store/activities/selectors';
import { FlashType } from '../../../types/CardType';
import CardHeader from '../../../components/cards/CardHeader';
import { FIRA_SANS_BOLD, NUNITO_LIGHT } from '../../../styles/fonts';
import { GREY, PINK, WHITE } from '../../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, MARGIN } from '../../../styles/metrics';
import CardFooter from '../../../components/cards/CardFooter';
import { FLASHCARD } from '../../../core/data/constants';
import AnimatedShadow from '../../../components/style/AnimatedShadow';

interface FlashCard {
  card: FlashType,
  index: number
}

const FlashCard = ({ card, index }: FlashCard) => {
  const [isPressed, setIsPressed] = useState(false);

  const animatedValue = new Animated.Value(0);
  let rotationValue = 0;

  animatedValue.addListener(({ value }) => { rotationValue = value; });
  React.useEffect(() => {
    if (isPressed === true) {
      if (rotationValue >= 90) {
        Animated.spring(animatedValue, {
          toValue: 0,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(animatedValue, {
          toValue: 180,
          friction: 8,
          tension: 10,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [isPressed, animatedValue, rotationValue]);

  if (!card || card.template !== FLASHCARD) return null;

  const flipCard = () => {
    if (!isPressed) {
      setIsPressed(true);
    } else if (rotationValue >= 90) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
  };
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [
      { rotateY: frontInterpolate },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      { rotateY: backInterpolate },
    ],
  };
  return (
    <>
      <CardHeader />
      <View style={styles.container}>
        <TouchableOpacity style= {styles.contentContainer}
          onPress= {flipCard}>
          <Animated.View style= {[styles.flipCard, frontAnimatedStyle]}>
            <Text style={styles.questionWatermark}>?</Text>
            <Text style={styles.question}>{card.text}</Text>
          </Animated.View>
          <Animated.View style= {[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}>
            <Text style={styles.answerWatermark}>!</Text>
            <Text style={styles.answer}>{card.backText}</Text>
          </Animated.View>
          <AnimatedShadow animatedStyle={frontAnimatedStyle} backgroundColor={GREY['200']}
            borderRadius={BORDER_RADIUS.LG}/>
        </TouchableOpacity>
      </View>
      <CardFooter index={index} template={card.template} isRightRemoved={!isPressed}/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: MARGIN.LG,
    marginVertical: MARGIN.XXL,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  contentContainer: {
    width: '100%',
  },
  flipCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: GREY['200'],
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: WHITE,
    backfaceVisibility: 'hidden',
  },
  question: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY['800'],
    textAlign: 'center',
    alignSelf: 'center',

  },
  questionWatermark: {
    ...NUNITO_LIGHT.XXXL,
    alignSelf: 'center',
    position: 'absolute',
    color: PINK['100'],
  },
  flipCardBack: {
    backgroundColor: PINK['400'],
    borderColor: PINK['500'],
    position: 'absolute',
    top: 0,
  },
  answer: {
    ...FIRA_SANS_BOLD.LG,
    color: WHITE,
    textAlign: 'center',
  },
  answerWatermark: {
    ...NUNITO_LIGHT.XXXL,
    alignSelf: 'center',
    position: 'absolute',
    color: PINK['500'],
  },

});

const mapStateToProps = (state: StateType) => ({ card: getCard(state), index: state.activities.cardIndex });

export default connect(mapStateToProps)(FlashCard);
