import React, { useEffect } from 'react';
import { View, Text, Image, ImageBackground, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Button from '../../../../components/form/Button';
import { navigate } from '../../../../navigationRef';
import { PINK, WHITE } from '../../../../styles/colors';
import CardHeader from '../../../../components/cards/CardHeader';
import ActivitiesActions from '../../../../store/activities/actions';
import { QuestionnaireAnswerType } from '../../../../types/store/ActivityStoreType';
import styles from './styles';
import MainActions from '../../../../store/main/actions';
import { ActivityHistoryType } from '../../../../types/ActivityHistoryType';

interface StartCardProps {
  title: string,
  courseId: string,
  isCourse: boolean,
  activityHistories: Array<ActivityHistoryType>,
  resetActivityReducer: () => void,
  setQuestionnaireAnswersList: (qalist: Array<QuestionnaireAnswerType>) => void,
  setStatusBarVisible: (boolean) => void,
}

const StartCard = ({
  title,
  courseId,
  isCourse,
  activityHistories,
  resetActivityReducer,
  setQuestionnaireAnswersList,
  setStatusBarVisible,
}: StartCardProps) => {
  const setActivityHistory = () => {
    const activityHistory = activityHistories[activityHistories.length - 1];

    if (activityHistory?.questionnaireAnswersList) {
      setQuestionnaireAnswersList(activityHistory.questionnaireAnswersList);
    }
  };

  useEffect(() => {
    if (isCourse) setActivityHistory();
    setStatusBarVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCourse]);

  const goBack = () => {
    resetActivityReducer();
    if (isCourse) navigate('CourseProfile', { courseId });
    else navigate('SubProgramProfile', { subProgram: courseId });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <CardHeader color={WHITE} onPress={() => goBack()} icon='arrow-left' />
      <View style={styles.wrapper}>
        <View>
          <ImageBackground imageStyle={{ resizeMode: 'contain' }} style={styles.imageBackground}
            source={require('../../../../../assets/images/start_card_background.png')}>
            <Image source={require('../../../../../assets/images/doct_liste.png')} style={styles.image} />
          </ImageBackground>
          <Text style={styles.text}>{title}</Text>
        </View>
        <Button style={styles.button} bgColor={WHITE} color={PINK[500]} caption="Démarrer"
          onPress={() => navigate('card-0')} />
      </View>
    </ScrollView>
  );
};

const mapStateToProps = state => ({
  isCourse: state.courses.isCourse,
  activityHistories: state.activities.activityHistories,
});

const mapDispatchToProps = dispatch => ({
  resetActivityReducer: () => dispatch(ActivitiesActions.resetActivityReducer()),
  setQuestionnaireAnswersList: questionnaireAnswersList =>
    dispatch(ActivitiesActions.setQuestionnaireAnswersList(questionnaireAnswersList)),
  setStatusBarVisible: statusBarVisible => dispatch(MainActions.setStatusBarVisible(statusBarVisible)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartCard);
