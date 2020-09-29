import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Button from '../../../components/form/Button';
import { navigate } from '../../../navigationRef';
import { PINK, WHITE } from '../../../styles/colors';
import { MARGIN } from '../../../styles/metrics';
import { FIRA_SANS_BLACK } from '../../../styles/fonts';
import CardHeader from '../../../components/cards/CardHeader';
import Actions from '../../../store/activities/actions';
import ActivityHistories from '../../../api/activityHistories';
import { ActivityType } from '../../../types/ActivityType';
import { QuestionnaireAnswerType } from '../../../types/store/ActivityStoreType';

interface StartCardProps {
  title: string,
  courseId: string,
  resetActivityReducer: () => void,
  activity: ActivityType,
  setQuestionnaireAnswersList: (qalist: Array<QuestionnaireAnswerType>) => void,
}

const StartCard = ({
  title,
  courseId,
  resetActivityReducer,
  activity,
  setQuestionnaireAnswersList,
}: StartCardProps) => {
  const getActivityHistory = async () => {
    const fetchedActivityHistory = await ActivityHistories.getActivityHistories(activity._id);

    setQuestionnaireAnswersList(fetchedActivityHistory?.questionnaireAnswersList
      ? fetchedActivityHistory?.questionnaireAnswersList
      : []);
  };

  useEffect(() => {
    async function fetchData() { await getActivityHistory(); }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    resetActivityReducer();
    navigate('Home', { screen: 'Courses', params: { screen: 'CourseProfile', params: { courseId } } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <CardHeader color={WHITE} onPress={() => goBack()} icon='arrow-left' />
      <View style={styles.wrapper}>
        <View>
          <ImageBackground imageStyle={{ resizeMode: 'contain' }} style={styles.imageBackground}
            source={require('../../../../assets/images/start_card_background.png')}>
            <Image source={require('../../../../assets/images/doct_liste.png')} style={styles.image} />
          </ImageBackground>
          <Text style={styles.text}>{title}</Text>
        </View>
        <Button style={styles.button} bgColor={WHITE} color={PINK['500']} caption="Démarrer"
          onPress={() => navigate('card-0')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PINK['500'],
  },
  contentContainer: {
    flexGrow: 1,
  },
  wrapper: {
    marginHorizontal: MARGIN.XL,
    justifyContent: 'space-between',
    flex: 1,
  },
  text: {
    ...FIRA_SANS_BLACK.XL,
    color: WHITE,
    marginTop: MARGIN.XXL,
    textAlign: 'center',
  },
  imageBackground: {
    height: 264,
    width: 288,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 128,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button: {
    marginBottom: MARGIN.XL,
  },
});

const mapStateToProps = state => ({
  activity: state.activities.activity,
});

const mapDispatchToProps = dispatch => ({
  resetActivityReducer: () => dispatch(Actions.resetActivityReducer()),
  setQuestionnaireAnswersList: questionnaireAnswersList =>
    dispatch(Actions.setQuestionnaireAnswersList(questionnaireAnswersList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartCard);
