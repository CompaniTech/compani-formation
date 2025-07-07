import 'array-flat-polyfill';
import { useState, useEffect, useCallback, useReducer } from 'react';
import { Text, View, ScrollView, ImageBackground, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import get from 'lodash/get';
import Courses from '../../../../api/courses';
import SubPrograms from '../../../../api/subPrograms';
import NextStepCell from '../../../../components/steps/NextStepCell';
import ProgramCell from '../../../../components/ProgramCell';
import CoursesSection, { EVENT_SECTION } from '../../../../components/CoursesSection';
import HomeScreenFooter from '../../../../components/HomeScreenFooter';
import { useGetLoggedUserId } from '../../../../store/main/hooks';
import commonStyles from '../../../../styles/common';
import { RootBottomTabParamList, RootStackParamList } from '../../../../types/NavigationType';
import { CourseType, SubProgramType, SubProgramWithProgramType } from '../../../../types/CourseTypes';
import { NextSlotsStepType } from '../../../../types/StepTypes';
import { getCourseProgress, getTheoreticalDuration } from '../../../../core/helpers/utils';
import { LEARNER, PEDAGOGY, IS_WEB, TUTOR } from '../../../../core/data/constants';
import styles from '../styles';
import { getElearningSteps } from '../helper';
import LearnerEmptyState from '../LearnerEmptyState';
import { PedagogyCourseListResponseType as PedagogyCourseListType } from '../../../../types/AxiosTypes';

interface LearnerCoursesProps extends CompositeScreenProps<
StackScreenProps<RootBottomTabParamList>,
StackScreenProps<RootStackParamList>
> {}

const SET_COURSES = 'SET_COURSES';
const RESET_COURSES = 'RESET_COURSES';
type CourseStateType = {
  onGoing: CourseType[],
  achieved: CourseType[],
  tutor: CourseType[],
};

type CourseActionType = { type: typeof SET_COURSES, payload: PedagogyCourseListType} | { type: typeof RESET_COURSES };

const courseReducer = (state: CourseStateType, action: CourseActionType) => {
  switch (action.type) {
    case SET_COURSES: {
      const { onGoing, achieved } = action.payload.traineeCourses;
      const tutor: CourseType[] = action.payload.tutorCourses;

      return { onGoing, achieved, tutor };
    }
    case RESET_COURSES:
      return { onGoing: [], achieved: [], tutor: [] };
    default:
      return state;
  }
};

const renderNextStepsItem = (step: NextSlotsStepType) => <NextStepCell nextSlotsStep={step} mode={LEARNER} />;

const LearnerCourses = ({ navigation }: LearnerCoursesProps) => {
  const loggedUserId = useGetLoggedUserId();

  const [courses, dispatch] = useReducer(courseReducer, { onGoing: [], achieved: [], tutor: [] });
  const [elearningDraftSubPrograms, setElearningDraftSubPrograms] = useState<SubProgramType[]>(new Array(0));
  const [nextSteps, setNextSteps] = useState<NextSlotsStepType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getCourses = useCallback(async () => {
    try {
      const fetchedCourses = await Courses.getCourseList({ action: PEDAGOGY });
      dispatch({ type: SET_COURSES, payload: fetchedCourses as PedagogyCourseListType });
      setNextSteps((fetchedCourses as PedagogyCourseListType).nextSteps);
      setRefreshing(false);
      setIsLoaded(true);
    } catch (e: any) {
      console.error(e);
      dispatch({ type: RESET_COURSES });
    }
  }, []);

  const getElearningDraftSubPrograms = useCallback(async () => {
    try {
      const fetchedSubPrograms = await SubPrograms.getELearningDraftSubPrograms();
      setElearningDraftSubPrograms(fetchedSubPrograms);
      setRefreshing(false);
      setIsLoaded(true);
    } catch (e: any) {
      console.error(e);
      setElearningDraftSubPrograms([]);
    }
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchData() {
      await Promise.all([getCourses(), getElearningDraftSubPrograms()]);
    }
    if (loggedUserId && isFocused) {
      if (!isLoaded) fetchData();
    }
  }, [loggedUserId, isFocused, getCourses, getElearningDraftSubPrograms, isLoaded]);

  const onPressProgramCell = (id: string, isCourse: boolean) => {
    if (isCourse) navigation.navigate('LearnerCourseProfile', { courseId: id });
    else {
      navigation.navigate('SubProgramProfile', { subProgramId: id });
    }
  };

  const renderCourseItem = (course: CourseType) => <ProgramCell program={get(course, 'subProgram.program') || {}}
    progress={getCourseProgress(course)} onPress={() => onPressProgramCell(course._id, true)} misc={get(course, 'misc')}
    theoreticalDuration={getTheoreticalDuration(getElearningSteps(get(course, 'subProgram.steps')))}/>;

  const renderTutorCourseItem = (course: CourseType) => <ProgramCell program={get(course, 'subProgram.program') || {}}
    theoreticalDuration={getTheoreticalDuration(getElearningSteps(get(course, 'subProgram.steps')))}
    onPress={() => navigation.navigate('LearnerCourseProfile', { courseId: course._id, mode: TUTOR })}
    misc={get(course, 'misc')} />;

  const renderSubProgramItem = (subProgram: SubProgramWithProgramType) => <ProgramCell program={subProgram.program}
    theoreticalDuration={getTheoreticalDuration(getElearningSteps(subProgram.steps))}
    onPress={() => onPressProgramCell(subProgram._id, false)} />;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([getCourses(), getElearningDraftSubPrograms()]);
  }, [getCourses, getElearningDraftSubPrograms]);

  const renderRefreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={IS_WEB}
        refreshControl={renderRefreshControl}>
        <Text style={commonStyles.title} testID='header'>Mes formations</Text>
        {!!nextSteps.length &&
          <View style={styles.nextSteps}>
            <CoursesSection items={nextSteps} title='Mes prochains rendez-vous' countStyle={styles.pinkCount}
              renderItem={renderNextStepsItem} type={EVENT_SECTION} />
          </View>
        }
        <ImageBackground imageStyle={styles.leftBackground} style={styles.sectionContainer}
          source={require('../../../../../assets/images/yellow_section_background.webp')}>
          <CoursesSection items={courses.onGoing} title='Mes formations en cours' renderItem={renderCourseItem}
            countStyle={styles.yellowCount} renderEmptyState={() => <LearnerEmptyState />}/>
        </ImageBackground>
        {!!courses.achieved.length &&
          <ImageBackground imageStyle={styles.rightBackground} style={styles.sectionContainer}
            source={require('../../../../../assets/images/green_section_background.webp')}>
            <CoursesSection items={courses.achieved} title='Mes formations terminées' renderItem={renderCourseItem}
              countStyle={styles.greenCount} />
          </ImageBackground>
        }
        {!!courses.tutor.length &&
          <ImageBackground imageStyle={styles.leftBackground} style={styles.sectionContainer}
            source={require('../../../../../assets/images/pink_section_background.webp')}>
            <CoursesSection items={courses.tutor} title='Tutorat' renderItem={renderTutorCourseItem}
              countStyle={styles.pinkCount} />
          </ImageBackground>
        }
        {!!elearningDraftSubPrograms.length &&
          <ImageBackground imageStyle={styles.rightBackground} style={styles.sectionContainer}
            source={require('../../../../../assets/images/purple_section_background.webp')}>
            <CoursesSection items={elearningDraftSubPrograms} title='Mes formations à tester'
              countStyle={styles.purpleCount} renderItem={renderSubProgramItem} />
          </ImageBackground>
        }
        <HomeScreenFooter source={require('../../../../../assets/images/pa_aidant_balade_rose.webp')} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnerCourses;
