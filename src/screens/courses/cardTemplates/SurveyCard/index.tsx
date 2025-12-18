import { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardHeader from '../../../../components/cards/CardHeader';
import QuestionCardFooter from '../../../../components/cards/QuestionCardFooter';
import SurveyScoreSelector from '../../../../components/cards/SurveyScoreSelector';
import {
  useAddQuestionnaireAnswer,
  useGetCard,
  useGetCardIndex,
  useGetQuestionnaireAnswer,
  useRemoveQuestionnaireAnswer,
} from '../../../../store/cards/hooks';
import { GREY, PINK } from '../../../../styles/colors';
import { EDGES } from '../../../../styles/metrics';
import { SurveyType } from '../../../../types/CardType';
import styles from './styles';

interface SurveyCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

const SurveyCard = ({ isLoading, setIsRightSwipeEnabled }: SurveyCardProps) => {
  const card: SurveyType = useGetCard();
  const index = useGetCardIndex();
  const questionnaireAnswer = useGetQuestionnaireAnswer();
  const addQuestionnaireAnswer = useAddQuestionnaireAnswer();
  const removeQuestionnaireAnswer = useRemoveQuestionnaireAnswer();
  const [selectedScore, setSelectedScore] = useState<string>('');

  useEffect(() => setIsRightSwipeEnabled(false));

  useEffect(() => {
    setSelectedScore(questionnaireAnswer ? questionnaireAnswer.answerList[0] : '');
  }, [questionnaireAnswer]);

  if (isLoading) return null;

  const isValidationDisabled = card.isMandatory && !selectedScore;

  const onPressScore = (score: string) => setSelectedScore(previousValue => (previousValue === score ? '' : score));

  const validateSurvey = () => {
    if (!selectedScore && card.isMandatory) return;
    if (card.isMandatory || selectedScore !== '') {
      addQuestionnaireAnswer({ card: card._id, answerList: [selectedScore] });
    } else removeQuestionnaireAnswer(card._id);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <CardHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>{card.question}</Text>
        <View style={styles.surveyScoreContainer}>
          <SurveyScoreSelector onPressScore={onPressScore} selectedScore={selectedScore} />
          <View style={styles.labelContainer}>
            {card.labels && Object.keys(card.labels).length &&
              Object.keys(card.labels)
                .map((labelKey, i) => <Text style={styles.text} key={i}>{labelKey} : {card.labels[labelKey]}</Text>)
            }
          </View>
        </View>
      </ScrollView>
      <QuestionCardFooter index={index} buttonColor={isValidationDisabled ? GREY[300] : PINK[500]}
        arrowColor={PINK[500]} buttonCaption='Valider' buttonDisabled={isValidationDisabled}
        validateCard={validateSurvey} />
    </SafeAreaView>
  );
};

export default SurveyCard;
