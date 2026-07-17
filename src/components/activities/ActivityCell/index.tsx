import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LEARNER, QUIZ } from '../../../core/data/constants';
import { ActivityType } from '../../../types/ActivityTypes';
import { CourseModeType } from '../../../types/CourseTypes';
import { useSetQuestionnaireAnswersList } from '../../../store/cards/hooks';
import { GREEN, WHITE, ORANGE, YELLOW } from '../../../styles/colors';
import { ICON } from '../../../styles/metrics';
import ActivityIcon from '../ActivityIcon';
import styles from './styles';

type ActivityCellProps = {
  activity: ActivityType,
  profileId: string,
  mode: CourseModeType,
}

export const SET_TO_GREEN = 'SET_TO_GREEN';
export const SET_TO_ORANGE = 'SET_TO_ORANGE';


const ActivityCell = React.memo(({ activity, profileId, mode }: ActivityCellProps) => {
  const setQuestionnaireAnswersList = useSetQuestionnaireAnswersList();
  const disabled = !activity.cards.length;
  const isCompleted = !!activity.activityHistories?.length;
  const lastScore = isCompleted ? activity.activityHistories[activity.activityHistories.length - 1].score : 0;
  const quizCount = activity.quizCount || 0;
  const isQuiz = activity.type === QUIZ;
  const isAboveAverage = isQuiz ? lastScore * 2 > quizCount : true;
  const navigation = useNavigation();
  const colors = isCompleted && isAboveAverage
    ? { border: GREEN[600], background: GREEN[300], check: GREEN[500] }
    : isCompleted
      ? { border: ORANGE[600], background: ORANGE[300], check: ORANGE[500] }
      : { border: YELLOW[600], background: YELLOW[300], check: undefined };

  const coloredStyle = styles(colors.check);

  const getQuestionnaireAnswersList = () => {
    const activityHistory = activity.activityHistories[activity.activityHistories.length - 1];
    if (activityHistory?.questionnaireAnswersList) {
      setQuestionnaireAnswersList(activityHistory.questionnaireAnswersList);
    }
  };

  const onPress = () => {
    if (mode === LEARNER) getQuestionnaireAnswersList();

    navigation.navigate('ActivityCardContainer', { activityId: activity._id, profileId, mode });
  };

  return (
    <View style={coloredStyle.container}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={coloredStyle.iconContainer}>
          <ActivityIcon activity={activity} disabled={disabled} backgroundColor={colors.background}
            borderColor={colors.border} />
          {isCompleted && !isQuiz &&
            <Ionicons name='checkmark-circle' size={ICON.MD} color={GREEN[500]} style={coloredStyle.icon}
              backgroundColor={WHITE} />}
          {isCompleted && isQuiz &&
            <View style={coloredStyle.scoreContainer}>
              <Text style={coloredStyle.score}>{lastScore}/{quizCount}</Text>
            </View>}
        </View>
      </TouchableOpacity>
      <Text style={coloredStyle.activityName} lineBreakMode={'tail'} numberOfLines={2}>
        {activity.name}
      </Text>
    </View>
  );
});

export default ActivityCell;
