import { useCallback, useEffect } from 'react';
import { Text, Image, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import get from 'lodash/get';
import has from 'lodash/has';
import ActivityHistories from '../../../../api/activityHistories';
import NiPrimaryButton from '../../../../components/form/PrimaryButton';
import asyncStorage from '../../../../core/helpers/asyncStorage';
import CompaniDuration from '../../../../core/helpers/dates/companiDurations';
import { formatSecondsToISODuration } from '../../../../core/helpers/dates/utils';
import { achievementJingle } from '../../../../core/helpers/utils';
import { LEARNER, TUTOR } from '../../../../core/data/constants';
import {
  useGetQuestionnaireAnswersList,
  useGetQuizzAnswersList,
  useGetScore,
  useSetCardIndex,
} from '../../../../store/cards/hooks';
import { EDGES } from '../../../../styles/metrics';
import styles from '../../../../styles/endCard';
import commonStyles from '../../../../styles/common';
import { ActivityType, QuestionnaireAnswersType, QuizzAnswersType } from '../../../../types/ActivityTypes';
import { CourseModeType } from '../../../../types/CourseTypes';
import { StoreAnswerType } from '../../../../types/CardType';

interface ActivityEndCardProps {
  mode: CourseModeType,
  activity: ActivityType,
  finalTimer: number,
  goBack: () => void,
  stopTimer: () => void,
}

const ActivityEndCard = ({ mode, activity, finalTimer, goBack, stopTimer }: ActivityEndCardProps) => {
  const questionnaireAnswersList = useGetQuestionnaireAnswersList();
  const quizzAnswersList = useGetQuizzAnswersList();
  const score = useGetScore();
  const setCardIndex = useSetCardIndex();
  const isFocused = useIsFocused();

  const saveHistory = useCallback(
    async (
      finalScore: number,
      finalQuestionnaireAnswersList: QuestionnaireAnswersType[],
      finalQuizzAnswersList: QuizzAnswersType[],
      numberDuration: number
    ) => {
      const userId = await asyncStorage.getUserId();

      if (!userId || !activity._id) return;

      const payload = {
        activity: activity._id,
        user: userId,
        score: finalScore,
        duration: CompaniDuration(formatSecondsToISODuration(numberDuration)).toISO(),
        ...(finalQuestionnaireAnswersList?.length && { questionnaireAnswersList: finalQuestionnaireAnswersList }),
        ...(finalQuizzAnswersList?.length && {
          quizzAnswersList: finalQuizzAnswersList
            .map(qa => ({
              ...qa,
              answerList: qa.answerList
                .filter(a => get(a, 'isSelected', true))
                .sort((a, b) => {
                  if (has(a, 'position') && has(b, 'position')) {
                    const answerA = a as StoreAnswerType;
                    const answerB = b as StoreAnswerType;

                    return answerA.position! - answerB.position!;
                  }
                  return 1;
                })
                .map(a => a._id),
            })),
        }),
      };

      await ActivityHistories.createActivityHistories(payload);
    },
    [activity._id]
  );

  useEffect(() => {
    if (isFocused) {
      stopTimer();
      setCardIndex(null);
      achievementJingle();
    }
  }, [isFocused, setCardIndex, mode, stopTimer, saveHistory]);

  useEffect(() => {
    if (finalTimer && [LEARNER, TUTOR].includes(mode)) {
      saveHistory(score, questionnaireAnswersList, quizzAnswersList, finalTimer);
    }
  }, [finalTimer, mode, questionnaireAnswersList, quizzAnswersList, saveHistory, score]);

  return (
    <SafeAreaView style={commonStyles.container} edges={EDGES}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <ImageBackground style={styles.elipse}
          source={require('../../../../../assets/images/end_card_background.webp')}>
          <Text style={styles.text}>Activité terminée</Text>
          <Image source={require('../../../../../assets/images/aux_fierte.webp')} style={styles.image} />
        </ImageBackground>
        <NiPrimaryButton customStyle={styles.button} caption="Terminer" onPress={goBack} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityEndCard;
