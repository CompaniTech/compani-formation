import { useEffect } from 'react';
import { Text, Image, ImageBackground, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import QuestionnaireHistories from '../../../../api/questionnaireHistories';
import NiPrimaryButton from '../../../../components/form/PrimaryButton';
import asyncStorage from '../../../../core/helpers/asyncStorage';
import { achievementJingle } from '../../../../core/helpers/utils';
import { useGetQuestionnaireAnswersList, useSetCardIndex } from '../../../../store/cards/hooks';
import styles from '../../../../styles/endCard';
import { QuestionnaireAnswersType } from '../../../../types/ActivityTypes';
import { QuestionnaireWithCardsType } from '../../../../types/QuestionnaireType';

interface QuestionnaireEndCardProps {
  courseId: string
  questionnaires: QuestionnaireWithCardsType[],
  goBack: () => void,
}

const QuestionnaireEndCard = ({ courseId, questionnaires, goBack }: QuestionnaireEndCardProps) => {
  const questionnaireAnswersList = useGetQuestionnaireAnswersList();
  const setCardIndex = useSetCardIndex();
  const isFocused = useIsFocused();

  useEffect(() => {
    async function createQuestionnaireHistories() {
      try {
        const userId = await asyncStorage.getUserId();

        if (!courseId || !userId || !questionnaires.length) return;

        if (questionnaires.length === 1) {
          const payload = {
            course: courseId,
            user: userId,
            questionnaire: questionnaires[0]._id,
            ...(questionnaireAnswersList?.length && { questionnaireAnswersList }),
          };

          await QuestionnaireHistories.createQuestionnaireHistories(payload);
        } else {
          const cardQuestionnaireList = Object
            .fromEntries(questionnaires.map(q => q.cards.map(c => [c._id, q._id])).flat());
          const answersGroupedByQuestionnaire: { [k: string]: QuestionnaireAnswersType[]; } = Object
            .fromEntries(questionnaires.map(q => [q._id, []]));

          questionnaireAnswersList.forEach((answer: QuestionnaireAnswersType) => {
            answersGroupedByQuestionnaire[cardQuestionnaireList[answer.card]].push(answer);
          });

          await Promise.all(
            Object.entries(answersGroupedByQuestionnaire)
              .map(([questionnaireId, answers]: [string, QuestionnaireAnswersType[]]) => {
                const payload = {
                  course: courseId,
                  questionnaire: questionnaireId,
                  user: userId,
                  questionnaireAnswersList: answers,
                };
                return QuestionnaireHistories.createQuestionnaireHistories(payload);
              })
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (isFocused) {
      createQuestionnaireHistories();
      achievementJingle();
    }
  }, [courseId, isFocused, questionnaires, questionnaireAnswersList, setCardIndex]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <ImageBackground style={styles.elipse} source={require('../../../../../assets/images/end_card_background.webp')}>
        <Text style={styles.text}>Questionnaire terminé</Text>
        <Image source={require('../../../../../assets/images/aux_fierte.webp')} style={styles.image} />
      </ImageBackground>
      <NiPrimaryButton customStyle={styles.button} caption="Terminer" onPress={goBack} />
    </ScrollView>
  );
};

export default QuestionnaireEndCard;
