import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardHeader from '../../../../components/cards/CardHeader';
import QuestionCardFooter from '../../../../components/cards/QuestionCardFooter';
import AnswerTextArea from '../../../../components/cards/AnswerTextArea';
import { IS_IOS } from '../../../../core/data/constants';
import {
  useAddQuestionnaireAnswer,
  useRemoveQuestionnaireAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuestionnaireAnswer,
} from '../../../../store/cards/hooks';
import { GREY, PINK } from '../../../../styles/colors';
import { EDGES, IS_LARGE_SCREEN, MARGIN } from '../../../../styles/metrics';
import { OpenQuestionType } from '../../../../types/CardType';
import styles from './styles';

interface OpenQuestionCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

const OpenQuestionCard = ({ isLoading, setIsRightSwipeEnabled }: OpenQuestionCardProps) => {
  const card: OpenQuestionType = useGetCard();
  const index = useGetCardIndex();
  const questionnaireAnswer = useGetQuestionnaireAnswer();
  const addQuestionnaireAnswer = useAddQuestionnaireAnswer();
  const removeQuestionnaireAnswer = useRemoveQuestionnaireAnswer();
  const [answer, setAnswer] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  const style = styles(isSelected);

  useEffect(() => setIsRightSwipeEnabled(false));

  useEffect(() => {
    setAnswer(questionnaireAnswer?.answerList ? questionnaireAnswer.answerList[0] : '');
  }, [questionnaireAnswer]);

  if (isLoading) return null;

  const isValidationDisabled = card.isMandatory && !answer;

  const validateQuestionnaireAnswer = () => {
    if (!answer && card.isMandatory) return;
    if (answer) addQuestionnaireAnswer({ card: card._id, answerList: [answer] });
    else removeQuestionnaireAnswer(card._id);
    setIsSelected(false);
  };

  const onFocusTextInput = (contentHeight: number) => scrollRef.current?.scrollTo({ y: contentHeight, animated: true });

  return (
    <SafeAreaView style={style.safeArea} edges={EDGES}>
      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'} style={style.keyboardAvoidingView}
        keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS}>
        {!isSelected && <CardHeader />}
        <ScrollView contentContainerStyle={style.container} ref={scrollRef} showsVerticalScrollIndicator={false}>
          <Text style={style.question}>{card.question}</Text>
          <View style={style.inputContainer}>
            <AnswerTextArea onChangeText={setAnswer} scrollTo={onFocusTextInput}
              onSelect={setIsSelected} answer={answer}/>
          </View>
        </ScrollView>
        <QuestionCardFooter index={index} buttonColor={isValidationDisabled ? GREY[300] : PINK[500]}
          arrowColor={PINK[500]} buttonCaption='Valider' buttonDisabled={isValidationDisabled}
          onPressArrow={() => setIsSelected(false)} validateCard={validateQuestionnaireAnswer} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OpenQuestionCard;
