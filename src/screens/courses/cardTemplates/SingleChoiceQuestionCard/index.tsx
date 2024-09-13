import { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import shuffle from 'lodash/shuffle';
import CardHeader from '../../../../components/cards/CardHeader';
import FooterGradient from '../../../../components/design/FooterGradient';
import { quizJingle } from '../../../../core/helpers/utils';
import QuizCardFooter from '../../../../components/cards/QuizCardFooter';
import QuizProposition from '../../../../components/cards/QuizProposition';
import {
  useAddQuizzAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuizzAnswer,
  useIncGoodAnswersCount,
} from '../../../../store/cards/hooks';
import cardsStyle from '../../../../styles/cards';
import { GREY, GREEN, ORANGE, PINK } from '../../../../styles/colors';
import { footerColorsType, QCAnswerType, SingleChoiceQuestionType } from '../../../../types/CardType';
import styles from './styles';

interface SingleChoiceQuestionCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

const SingleChoiceQuestionCard = ({ isLoading, setIsRightSwipeEnabled }: SingleChoiceQuestionCardProps) => {
  const card: SingleChoiceQuestionType = useGetCard();
  const index = useGetCardIndex();
  const incGoodAnswersCount = useIncGoodAnswersCount();
  const quizzAnswer = useGetQuizzAnswer();
  const addQuizzAnswer = useAddQuizzAnswer();
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(false);
  const [answers, setAnswers] = useState<QCAnswerType[]>([]);
  const [footerColors, setFooterColors] = useState<footerColorsType>({
    buttons: PINK[500],
    text: GREY[100],
    background: GREY[100],
  });

  useEffect(() => {
    if (!isLoading && !isPressed) {
      if (quizzAnswer?.answerList.length) {
        setAnswers(quizzAnswer.answerList as QCAnswerType[]);
        setIsPressed(true);
        const isAnswerCorrect = (quizzAnswer.answerList as QCAnswerType[])
          .every(answer => answer.isSelected === answer.correct);
        setIsAnsweredCorrectly(isAnswerCorrect);
      } else setAnswers(shuffle(card.qcAnswers.map(ans => ({ ...ans, isSelected: false }))));
    }
    setIsRightSwipeEnabled(isPressed);
  }, [isLoading, card, isPressed, setIsRightSwipeEnabled, quizzAnswer]);

  useEffect(() => {
    if (!isPressed) {
      return setFooterColors({ buttons: PINK[500], text: GREY[100], background: GREY[100] });
    }

    if (isAnsweredCorrectly) {
      return setFooterColors({ buttons: GREEN[600], text: GREEN[600], background: GREEN[100] });
    }

    return setFooterColors({ buttons: ORANGE[600], text: ORANGE[600], background: ORANGE[100] });
  }, [answers, isAnsweredCorrectly, isPressed]);

  if (isLoading) return null;

  const renderItem = (item: QCAnswerType, answerIndex: number) => <QuizProposition onPress={onSelectAnswer}
    isValidated={isPressed} isGoodAnswer={item.correct} index={answerIndex} item={item.text}
    isSelected={item.isSelected} />;

  const onSelectAnswer = (selectedIndex: number) => {
    const updatedAnswers = answers.map((answer, i) => (i === selectedIndex ? { ...answer, isSelected: true } : answer));
    setAnswers(updatedAnswers);

    const isAnswerCorrect = updatedAnswers.every(answer => answer.isSelected === answer.correct);
    setIsAnsweredCorrectly(isAnswerCorrect);

    quizJingle(isAnswerCorrect);

    if (isAnswerCorrect) incGoodAnswersCount();
    addQuizzAnswer({ card: card._id, answerList: updatedAnswers });

    setIsPressed(true);
  };

  const style = styles(isPressed, footerColors.background);

  return (
    <SafeAreaView style={style.safeArea} edges={['top']}>
      <CardHeader />
      <ScrollView contentContainerStyle={style.container} showsVerticalScrollIndicator={false}>
        <Text style={cardsStyle.question}>{card.question}</Text>
        <View>
          <Text style={cardsStyle.informativeText}>Une seule réponse est possible</Text>
          {answers.map((item, answerIndex) => <View key={answerIndex}>{renderItem(item, answerIndex)}</View>)}
        </View>
      </ScrollView>
      <View style={style.footerContainer}>
        {!isPressed && <FooterGradient />}
        <QuizCardFooter isValidated={isPressed} isValid={isAnsweredCorrectly}
          cardIndex={index} footerColors={footerColors} explanation={card.explanation}
          buttonDisabled={!isPressed} hideButton />
      </View>
    </SafeAreaView>
  );
};

export default SingleChoiceQuestionCard;
