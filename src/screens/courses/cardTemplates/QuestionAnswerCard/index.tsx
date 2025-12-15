import { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnswerFromAPIType, QuestionAnswerType } from '../../../../types/CardType';
import CardHeader from '../../../../components/cards/CardHeader';
import QuestionCardFooter from '../../../../components/cards/QuestionCardFooter';
import FooterGradient from '../../../../components/design/FooterGradient';
import QuestionAnswerProposition from '../../../../components/cards/QuestionAnswerProposition';
import {
  useAddQuestionnaireAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuestionnaireAnswer,
  useRemoveQuestionnaireAnswer,
} from '../../../../store/cards/hooks';
import cardsStyle from '../../../../styles/cards';
import { GREY, PINK } from '../../../../styles/colors';
import styles from './styles';

interface QuestionAnswerCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

export interface AnswerType extends AnswerFromAPIType {
  isSelected: boolean,
}

const QuestionAnswerCard = ({ isLoading, setIsRightSwipeEnabled }: QuestionAnswerCardProps) => {
  const card: QuestionAnswerType = useGetCard();
  const cardIndex = useGetCardIndex();
  const questionnaireAnswer = useGetQuestionnaireAnswer();
  const addQuestionnaireAnswer = useAddQuestionnaireAnswer();
  const removeQuestionnaireAnswer = useRemoveQuestionnaireAnswer();
  const [selectedAnswers, setSelectedAnswers] = useState<AnswerType[]>([]);

  useEffect(() => setIsRightSwipeEnabled(false));

  useEffect(() => {
    if (!isLoading) {
      setSelectedAnswers(card.qcAnswers.map(answer =>
        ({ ...answer, isSelected: !!questionnaireAnswer?.answerList.includes(answer._id) })));
    }
  }, [card, isLoading, questionnaireAnswer]);

  if (isLoading) return null;

  const isAnswerSelected = () => selectedAnswers.some(answer => answer.isSelected);
  const isValidationDisabled = card.isMandatory && !isAnswerSelected();

  const onSelectAnswer = (index: number) => {
    if (!card.isQuestionAnswerMultipleChoiced) {
      setSelectedAnswers(array => array.map((answer, answerIdx) => ((answerIdx === index)
        ? answer
        : { ...answer, isSelected: false })));
    }
    setSelectedAnswers(array => Object.assign(
      [],
      array,
      { [index]: { ...array[index], isSelected: !array[index].isSelected } }
    ));
  };

  const validateQuestionnaireAnswer = () => {
    const answer = selectedAnswers.filter(sa => sa.isSelected).map(sa => sa._id);
    if (card.isMandatory && !isAnswerSelected()) return;
    if (card.isMandatory || isAnswerSelected()) addQuestionnaireAnswer({ card: card._id, answerList: answer });
    else removeQuestionnaireAnswer(card._id);
  };

  const renderItem = (item: AnswerType, index: number) => <QuestionAnswerProposition onPress={onSelectAnswer}
    item={item.text} isSelected={item.isSelected} index={index} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CardHeader />
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={cardsStyle.question}>{card.question}</Text>
        <View style={styles.container}>
          {card.isQuestionAnswerMultipleChoiced
            ? <Text style={cardsStyle.informativeText}>Plusieurs réponses sont possibles</Text>
            : <Text style={cardsStyle.informativeText}>Une seule réponse est possible</Text>
          }
          {selectedAnswers.map((item, index) => <View key={index}>{renderItem(item, index)}</View>)}
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <FooterGradient />
        <QuestionCardFooter buttonCaption={'Valider'} arrowColor={PINK[500]} index={cardIndex}
          buttonDisabled={isValidationDisabled} buttonColor={isValidationDisabled ? GREY[300] : PINK[500]}
          validateCard={validateQuestionnaireAnswer}/>
      </View>
    </SafeAreaView>
  );
};

export default QuestionAnswerCard;
