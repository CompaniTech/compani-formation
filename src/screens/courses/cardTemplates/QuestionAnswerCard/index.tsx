import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnswerFromAPIType, QuestionAnswerType } from '../../../../types/CardType';
import CardHeader from '../../../../components/cards/CardHeader';
import QuestionCardFooter from '../../../../components/cards/QuestionCardFooter';
import FooterGradient from '../../../../components/design/FooterGradient';
import QuestionAnswerProposition from '../../../../components/cards/QuestionAnswerProposition';
import Shadow from '../../../../components/design/Shadow';
import {
  useAddQuestionnaireAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuestionnaireAnswer,
  useRemoveQuestionnaireAnswer,
} from '../../../../store/cards/hooks';
import cardsStyle from '../../../../styles/cards';
import { EDGES, IS_LARGE_SCREEN, MARGIN } from '../../../../styles/metrics';
import { IS_IOS } from '../../../../core/data/constants';
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
  const [otherAnswer, setOtherAnswer] = useState<string>('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => setIsRightSwipeEnabled(false));

  useEffect(() => {
    if (!isLoading) {
      setSelectedAnswers(card.qcAnswers.map(answer =>
        ({ ...answer, isSelected: !!questionnaireAnswer?.answerList.includes(answer._id) })));
      const qcAnswersIds = card.qcAnswers.map(a => a._id);
      const otherAnswerFromStore = questionnaireAnswer?.answerList.find(v => !qcAnswersIds.includes(v));
      setOtherAnswer(otherAnswerFromStore ?? '');
    }
  }, [card, isLoading, questionnaireAnswer]);

  useEffect(() => {
    if (otherAnswer && !card.isQuestionAnswerMultipleChoiced) {
      setSelectedAnswers(array => array.map(a => ({ ...a, isSelected: false })));
    }
  }, [otherAnswer, card.isQuestionAnswerMultipleChoiced]);

  if (isLoading) return null;

  const isAnswerSelected = () => selectedAnswers.some(answer => answer.isSelected) || !!otherAnswer;
  const isValidationDisabled = card.isMandatory && !isAnswerSelected();

  const onSelectAnswer = (index: number) => {
    if (!card.isQuestionAnswerMultipleChoiced) {
      setOtherAnswer('');
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
    const answerList = !otherAnswer ? answer : [...answer, otherAnswer];
    if (card.isMandatory && !isAnswerSelected()) return;
    if (card.isMandatory || isAnswerSelected()) addQuestionnaireAnswer({ card: card._id, answerList });
    else removeQuestionnaireAnswer(card._id);
  };

  const renderItem = (item: AnswerType, index: number) => <QuestionAnswerProposition onPress={onSelectAnswer}
    item={item.text} isSelected={item.isSelected} index={index} />;

  const style = styles(!!otherAnswer);
 
  return (
    <SafeAreaView style={style.safeArea} edges={EDGES}>
      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={style.keyboardAvoidingView}
        keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS}>
        <CardHeader />
        <ScrollView ref={scrollRef} contentContainerStyle={style.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={cardsStyle.question}>{card.question}</Text>
          <View style={style.container}>
            {card.isQuestionAnswerMultipleChoiced
              ? <Text style={cardsStyle.informativeText}>Plusieurs réponses sont possibles</Text>
              : <Text style={cardsStyle.informativeText}>Une seule réponse est possible</Text>
            }
            {selectedAnswers.map((item, index) => <View key={index}>{renderItem(item, index)}</View>)}
            {card.allowOtherAnswer && <View style={style.answerContainer}>
              <TextInput placeholder="Autre réponse" value={otherAnswer}  clearButtonMode='always'
                style={style.otherAnswerInput} placeholderTextColor={GREY[600]} onChangeText={setOtherAnswer}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })} />
              <Shadow customStyle={style.shadow} />
            </View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={style.footerContainer}>
        <FooterGradient />
        <QuestionCardFooter buttonCaption={'Valider'} arrowColor={PINK[500]} index={cardIndex}
          buttonDisabled={isValidationDisabled} buttonColor={isValidationDisabled ? GREY[300] : PINK[500]}
          validateCard={validateQuestionnaireAnswer} />
      </View>
    </SafeAreaView>
  );
};

export default QuestionAnswerCard;
