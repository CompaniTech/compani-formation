import { ReactNode, useEffect, useState } from 'react';
import { ScrollView, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-worklets';
import Animated from 'react-native-reanimated';
import shuffle from 'lodash/shuffle';
import { Droppable, DropProvider, useDraggable } from 'react-native-reanimated-dnd';
import { useNavigation } from '@react-navigation/native';
import CardHeader from '../../../../components/cards/CardHeader';
import QuizCardFooter from '../../../../components/cards/QuizCardFooter';
import FillTheGapProposition from '../../../../components/cards/FillTheGapProposition';
import FillTheGapQuestion from '../../../../components/cards/FillTheGapQuestion';
import FillTheGapPropositionList from '../../../../components/cards/FillTheGapPropositionList';
import { IS_WEB } from '../../../../core/data/constants';
import { quizJingle } from '../../../../core/helpers/utils';
import {
  useAddQuizzAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuizzAnswer,
  useIncGoodAnswersCount,
} from '../../../../store/cards/hooks';
import { PINK, GREY, GREEN, ORANGE } from '../../../../styles/colors';
import { EDGES } from '../../../../styles/metrics';
import { FillTheGapType, footerColorsType, StoreAnswerType } from '../../../../types/CardType';
import styles from './styles';

interface FillTheGap {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

export interface FillTheGapAnswers {
  text: string
  isSelected: boolean,
  _id: string,
}

interface DraggableAnswerProps {
  id: string,
  style: StyleProp<ViewStyle>,
  onTap: () => void,
  children: ReactNode,
}

const DraggableAnswer = ({ id, style, onTap, children }: DraggableAnswerProps) => {
  const { animatedViewProps, gesture, animatedViewRef } = useDraggable<string>({ data: id });
  const tapGesture = Gesture.Tap().maxDistance(10).onEnd(() => { runOnJS(onTap)(); });
  const composedGesture = Gesture.Exclusive(tapGesture, gesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View ref={animatedViewRef} {...animatedViewProps} style={[style, animatedViewProps.style]}
        collapsable={false}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const FillTheGapCard = ({ isLoading, setIsRightSwipeEnabled }: FillTheGap) => {
  const card: FillTheGapType = useGetCard();
  const index = useGetCardIndex();
  const incGoodAnswersCount = useIncGoodAnswersCount();
  const quizzAnswer = useGetQuizzAnswer();
  const addQuizzAnswer = useAddQuizzAnswer();
  const [goodAnswers, setGoodAnswers] = useState<string[]>([]);
  const [propositions, setPropositions] = useState<FillTheGapAnswers[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(false);
  const areGapsFilled = !selectedAnswers.filter(answer => answer === '').length;
  const footerColors: footerColorsType = !isValidated
    ? { buttons: PINK[500], text: GREY[100], background: GREY[100] }
    : isAnsweredCorrectly
      ? { buttons: GREEN[600], text: GREEN[600], background: GREEN[100] }
      : { buttons: ORANGE[600], text: ORANGE[600], background: ORANGE[100] };

  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isValidated) {
      setGoodAnswers(card.gapAnswers.filter(a => a.isCorrect).map(a => a._id));
    }
  }, [card, isLoading, isValidated]);

  useEffect(() => {
    if (!isLoading && !isValidated) {
      if (quizzAnswer?.answerList.length && goodAnswers.length) {
        const answerList = quizzAnswer.answerList as StoreAnswerType[];
        setPropositions(answerList.map(a => ({ _id: a._id, isSelected: a.isSelected, text: a.text })));
        setIsValidated(true);
        setSelectedAnswers(
          answerList.filter(a => a.isSelected).sort((a, b) => a.position! - b.position!).map(a => a._id)
        );
        const areAnswersCorrect = card.canSwitchAnswers
          ? answerList.every(a => a.isSelected === a.isCorrect)
          : answerList.filter(a => a.isSelected).every(a => (a._id === goodAnswers[a.position!]));
        setIsAnsweredCorrectly(areAnswersCorrect);
      } else {
        setPropositions(shuffle(card.gapAnswers.map(a => ({ text: a.text, _id: a._id, isSelected: false }))));
        setSelectedAnswers(goodAnswers.map(() => ''));
      }
    }
    setIsRightSwipeEnabled(isValidated);
  }, [card, goodAnswers, isLoading, isValidated, quizzAnswer, setIsRightSwipeEnabled]);

  if (isLoading) return null;

  const style = styles(footerColors.background);

  const setAnswersAndPropositions = (movedProp: string, gapIndex?: number, isActionClick = false) => {
    const newPropositions = [...propositions];
    const selectedPropIdx = newPropositions.map(prop => prop._id).indexOf(movedProp);
    const selectedAnswerIdx = selectedAnswers.indexOf(movedProp);

    const updateAnswer = (gapIdx: number, newGapValue: string) => {
      setSelectedAnswers(array => Object.assign([], array, { [gapIdx]: newGapValue }));
      newPropositions[selectedPropIdx].isSelected = !!newGapValue;
    };

    const isMovingSelectedAnswer = selectedAnswerIdx > -1;
    if (isMovingSelectedAnswer) updateAnswer(selectedAnswerIdx, '');

    const isFillingGapByClicking = isActionClick && !isMovingSelectedAnswer;
    const emptyGapIdx = selectedAnswers.indexOf('');
    if (isFillingGapByClicking && emptyGapIdx > -1) updateAnswer(emptyGapIdx, movedProp);

    const isFillingGapByDroping = !isActionClick && Number.isInteger(gapIndex);
    if (isFillingGapByDroping) {
      const isGapAlreadyFilled = selectedAnswers[gapIndex!] && selectedAnswers[gapIndex!] !== movedProp;
      if (isGapAlreadyFilled) {
        const previousAnswerIdx = newPropositions.map(prop => prop._id).indexOf(selectedAnswers[gapIndex!]);
        newPropositions[previousAnswerIdx].isSelected = false;
      }
      updateAnswer(gapIndex!, movedProp);
    }
    setPropositions(newPropositions);
  };

  const isGoodAnswer = (propositionId: string, idx?: number) => {
    if (Number.isInteger(idx)) {
      return card.canSwitchAnswers ? goodAnswers.includes(propositionId) : goodAnswers.indexOf(propositionId) === idx;
    }

    return goodAnswers.includes(propositionId);
  };

  const renderContent = (item: FillTheGapAnswers, idx?: number) => {
    if (item.isSelected) return <></>;

    const proposition = <FillTheGapProposition item={item} isValidated={isValidated}
      isSelected={selectedAnswers.includes(item._id)} isGoodAnswer={isGoodAnswer(item._id, idx)} />;

    const setAnswerOnClick = () => setAnswersAndPropositions(item._id, undefined, true);

    if (IS_WEB) {
      return <TouchableOpacity style={style.answerContainer} onPress={setAnswerOnClick}>
        {proposition}
      </TouchableOpacity>;
    }

    return <DraggableAnswer id={item._id} style={style.answerContainer} onTap={setAnswerOnClick}>
      {proposition}
    </DraggableAnswer>;
  };

  const renderGap = (idx: number) => {
    const proposition = {
      ...propositions.find(p => p._id === selectedAnswers[idx]),
      isSelected: !selectedAnswers[idx],
    };

    if (IS_WEB) {
      return <View style={style.gapContainer} key={`gap${idx}`}>
        {renderContent(proposition as FillTheGapAnswers, idx)}
      </View>;
    }

    return <Droppable<string> style={style.gapContainer} key={`gap${idx}`}
      onDrop={movedProp => setAnswersAndPropositions(movedProp, idx)}>
      {renderContent(proposition as FillTheGapAnswers, idx)}
    </Droppable>;
  };

  const onPressFooterButton = () => {
    if (!isValidated) {
      const areAnswersCorrect = card.canSwitchAnswers
        ? selectedAnswers.every(_id => goodAnswers.includes(_id))
        : selectedAnswers.every((_id, idx) => (_id === goodAnswers[idx]));

      quizJingle(areAnswersCorrect);
      setIsAnsweredCorrectly(areAnswersCorrect);
      if (areAnswersCorrect) incGoodAnswersCount();
      const answers = propositions
        .map(p => ({
          ...p,
          isCorrect: goodAnswers.includes(p._id),
          ...p.isSelected && { position: selectedAnswers.indexOf(p._id) },
        }));
      addQuizzAnswer({ card: card._id, answerList: answers });

      return setIsValidated(true);
    }
    return index !== null ? navigation.navigate(`card-${index + 1}`) : null;
  };

  return (
    <SafeAreaView style={style.safeArea} edges={EDGES}>
      <CardHeader />
      <ScrollView contentContainerStyle={style.container} showsVerticalScrollIndicator={false}>
        {IS_WEB
          ? <>
            <FillTheGapQuestion text={card.gappedText} isValidated={isValidated} renderGap={renderGap} />
            <FillTheGapPropositionList isValidated={isValidated} propositions={propositions}
              setProposition={setAnswersAndPropositions} renderContent={renderContent} />
          </>
          : <DropProvider>
            <FillTheGapQuestion text={card.gappedText} isValidated={isValidated} renderGap={renderGap} />
            <FillTheGapPropositionList isValidated={isValidated} propositions={propositions}
              setProposition={setAnswersAndPropositions} renderContent={renderContent} />
          </DropProvider>
        }
        <View style={style.contentContainer}>
          <View style={style.footerContainer}>
            <QuizCardFooter isValidated={isValidated} isValid={isAnsweredCorrectly} cardIndex={index}
              buttonDisabled={!areGapsFilled} footerColors={footerColors} explanation={card.explanation}
              onPressFooterButton={onPressFooterButton} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FillTheGapCard;
