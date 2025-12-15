import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import shuffle from 'lodash/shuffle';
import { useNavigation } from '@react-navigation/native';
import CardHeader from '../../../../components/cards/CardHeader';
import QuizCardFooter from '../../../../components/cards/QuizCardFooter';
import FooterGradient from '../../../../components/design/FooterGradient';
import OrderProposition, { OrderPropositionRef } from '../../../../components/cards/OrderProposition';
import { quizJingle } from '../../../../core/helpers/utils';
import {
  useAddQuizzAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuizzAnswer,
  useIncGoodAnswersCount,
} from '../../../../store/cards/hooks';
import cardsStyle from '../../../../styles/cards';
import { GREEN, GREY, ORANGE, PINK } from '../../../../styles/colors';
import { footerColorsType, OrderTheSequenceType, AnswerPositionType } from '../../../../types/CardType';
import styles from './styles';

interface OrderTheSequenceCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

const OrderTheSequenceCard = ({ isLoading, setIsRightSwipeEnabled }: OrderTheSequenceCardProps) => {
  const card: OrderTheSequenceType = useGetCard();
  const cardIndex = useGetCardIndex();
  const incGoodAnswersCount = useIncGoodAnswersCount();
  const quizzAnswer = useGetQuizzAnswer();
  const addQuizzAnswer = useAddQuizzAnswer();
  const [answers, setAnswers] = useState<AnswerPositionType[]>([]);
  const itemRefs = useRef<OrderPropositionRef[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number| null>(null);
  const [dragCount, setDragCount] = useState<number>(0);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isOrderedCorrectly, setIsOrderedCorrectly] = useState<boolean>(false);
  const [propsHeight, setPropsHeight] = useState<number[]>([]);
  const [allowedOffsetYList, setAllowedOffsetYList] = useState<number[][][]>([]);
  const [sumOtherHeightsList, setSumOtherHeightsList] = useState<number[]>([]);
  const [footerColors, setFooterColors] = useState<footerColorsType>({
    buttons: PINK[500],
    text: GREY[100],
    background: GREY[100],
  });
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isValidated) {
      if (quizzAnswer?.answerList.length) {
        setAnswers(quizzAnswer.answerList as AnswerPositionType[]);
        setIsValidated(true);
        const isOrderCorrect = (quizzAnswer.answerList as AnswerPositionType[])
          .every(answer => (answer.goodPosition === answer.tempPosition));
        setIsOrderedCorrectly(isOrderCorrect);
      } else {
        const shuffledCards = shuffle(card.orderedAnswers
          .map((ans, answerIndex) => ({ label: ans.text, goodPosition: answerIndex, _id: ans._id })));
        setAnswers(shuffledCards.map((ans, answerIndex) => ({ ...ans, tempPosition: answerIndex })));
      }
    }
    setIsRightSwipeEnabled(isValidated || false);
  }, [card, isValidated, isLoading, setIsRightSwipeEnabled, quizzAnswer]);

  useEffect(() => {
    if (!isValidated) {
      return setFooterColors({ buttons: PINK[500], text: GREY[100], background: GREY[100] });
    }

    if (isOrderedCorrectly) {
      return setFooterColors({ buttons: GREEN[600], text: GREEN[600], background: GREEN[100] });
    }

    return setFooterColors({ buttons: ORANGE[600], text: ORANGE[600], background: ORANGE[100] });
  }, [isValidated, answers, isOrderedCorrectly]);

  useEffect(() => {
    const tempSumOtherHeightsList = propsHeight.map((height, index) =>
      propsHeight.filter((_, i) => i !== index).reduce((a, b) => a + b, 0));
    setSumOtherHeightsList(tempSumOtherHeightsList);

    const tempAllowedOffsetYList = [
      [[0], [propsHeight[1], propsHeight[2]], [tempSumOtherHeightsList[0]]],
      [[-propsHeight[0]], [propsHeight[2] - propsHeight[0], 0], [propsHeight[2]]],
      [[-tempSumOtherHeightsList[2]], [-propsHeight[1], -propsHeight[0]], [0]],
    ];
    setAllowedOffsetYList(tempAllowedOffsetYList);
  }, [propsHeight]);

  const onPressFooterButton = () => {
    if (!isValidated) {
      const isOrderCorrect = answers.every(answer => (answer.goodPosition === answer.tempPosition));

      quizJingle(isOrderCorrect);
      setIsOrderedCorrectly(isOrderCorrect);
      if (isOrderCorrect) incGoodAnswersCount();
      addQuizzAnswer({ card: card._id, answerList: [...answers].sort((a, b) => a.tempPosition - b.tempPosition) });

      return setIsValidated(true);
    }
    return cardIndex !== null ? navigation.navigate(`card-${cardIndex + 1}`) : null;
  };

  const setAnswersTempPositions = (index: number, positionCount: number) => {
    const newPosition = answers[index].tempPosition + positionCount;
    const newAnswers = answers.map((ans: AnswerPositionType, answerIndex: number) => {
      let tmpPosition = ans.tempPosition;
      if (answerIndex === index) tmpPosition = newPosition;
      if (ans.tempPosition === newPosition || (Math.abs(positionCount) === 2 && answerIndex !== index)) {
        tmpPosition = positionCount < 0 ? ans.tempPosition + 1 : ans.tempPosition - 1;
      }

      return { label: ans.label, goodPosition: ans.goodPosition, tempPosition: tmpPosition, _id: ans._id };
    });
    setDraggedIndex(null);
    setAnswers(newAnswers);
  };

  const onMove = (index: number, targetPosition: number, orientation: string) => {
    const itemToMoveIndex = answers.findIndex(answer => answer.tempPosition === targetPosition);
    if (itemToMoveIndex < 0) return;
    itemRefs.current[itemToMoveIndex].moveTo(propsHeight[index], orientation);
  };

  const renderInformativeText = () => (
    <Text style={cardsStyle.informativeText}>
      {
        card.isChronological
          ? 'Classez les réponses dans l\'ordre chronologique'
          : 'Classez les réponses dans le bon ordre : de la meilleure à la moins bonne'
      }
    </Text>
  );

  if (isLoading) return null;

  const setHeight = (height: number, index: number) => {
    setPropsHeight((prevState: number[]) => {
      const newState = [...prevState];
      newState[index] = height;

      return newState;
    });
  };

  const style = styles(footerColors.background);

  return (
    <SafeAreaView style={style.safeArea}>
      <CardHeader />
      <ScrollView contentContainerStyle={style.container}>
        <Text style={[cardsStyle.question, style.question]}>{card.question}</Text>
        <View style={style.propositionsContainer}>
          {renderInformativeText()}
          {answers.map((_, index) =>
            <OrderProposition key={index} index={index} isValidated={isValidated} draggedIndex={draggedIndex}
              setDraggedIndex={setDraggedIndex} dragCount={dragCount} setDragCount={setDragCount} items={answers}
              setAnswersTempPositions={setAnswersTempPositions} onMove={onMove} setHeight={setHeight}
              propsHeight={propsHeight} ref={(el: OrderPropositionRef) => { itemRefs.current[index] = el; }}
              allowedOffsetY={allowedOffsetYList[index]} sumOtherHeights={sumOtherHeightsList[index]} />)}
        </View>
        <View style={style.footerContainer}>
          {!isValidated && <FooterGradient />}
          <QuizCardFooter isValidated={isValidated} isValid={isOrderedCorrectly} cardIndex={cardIndex}
            buttonDisabled={false} footerColors={footerColors} explanation={card.explanation}
            onPressFooterButton={onPressFooterButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderTheSequenceCard;
