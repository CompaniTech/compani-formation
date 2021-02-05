import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { OpenQuestionType } from '../../../../types/CardType';
import { ActionType, StateType } from '../../../../types/store/StoreType';
import Selectors from '../../../../store/activities/selectors';
import CardHeader from '../../../../components/cards/CardHeader';
import { GREY, PINK } from '../../../../styles/colors';
import { IS_LARGE_SCREEN, MARGIN } from '../../../../styles/metrics';
import QuestionCardFooter from '../../../../components/cards/QuestionCardFooter';
import AnswerTextArea from '../../../../components/cards/AnswerTextArea';
import { QuestionnaireAnswerType } from '../../../../types/store/ActivityStoreType';
import Actions from '../../../../store/activities/actions';
import styles from './styles';

interface OpenQuestionCardProps {
  card: OpenQuestionType,
  index: number,
  questionnaireAnswer: QuestionnaireAnswerType,
  addQuestionnaireAnswer: (qa: QuestionnaireAnswerType) => void,
  isLoading: boolean,
}

const OpenQuestionCard = ({
  card,
  index,
  questionnaireAnswer,
  addQuestionnaireAnswer,
  isLoading,
}: OpenQuestionCardProps) => {
  const [answer, setAnswer] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  const isIOS = Platform.OS === 'ios';
  const style = styles(isSelected);

  useEffect(() => {
    setAnswer(questionnaireAnswer?.answerList ? questionnaireAnswer.answerList[0] : '');
  }, [questionnaireAnswer]);

  if (isLoading) return null;

  const isValidationDisabled = card.isMandatory && !answer;

  const validateQuestionnaireAnswer = () => {
    addQuestionnaireAnswer({ card: card._id, answerList: [answer] });
    setIsSelected(false);
  };

  const onFocusTextInput = contentHeight => scrollRef.current?.scrollTo({ y: contentHeight, animated: true });

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={style.keyboardAvoidingView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS} >
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
  );
};

const mapStateToProps = (state: StateType) => ({
  card: Selectors.getCard(state),
  index: state.activities.cardIndex,
  questionnaireAnswer: Selectors.getQuestionnaireAnswer(state),
});

const mapDispatchToProps = (dispatch: ({ type }: ActionType) => void) => ({
  addQuestionnaireAnswer: (qa: QuestionnaireAnswerType) => dispatch(Actions.addQuestionnaireAnswer(qa)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenQuestionCard);
