import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { StackActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/NavigationType';
import Courses from '../../../api/courses';
import { getLoggedUserId } from '../../../store/main/selectors';
import { ELearningCourseType } from '../../../types/CourseTypes';
import About from '../../../components/About';
import { LEARNER } from '../../../core/data/constants';

interface ElearningAboutProps extends StackScreenProps<RootStackParamList, 'ElearningAbout'> {
  loggedUserId: string,
}

const ElearningAbout = ({ route, navigation, loggedUserId }: ElearningAboutProps) => {
  const { program } = route.params;
  const [hasAlreadySubscribed, setHasAlreadySubscribed] = useState(false);
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    const subProgram = program.subPrograms ? program.subPrograms[0] : null;
    const course = subProgram?.courses ? subProgram.courses[0] : null;
    if (course) {
      setCourseId(course._id);

      const { trainees } = course as ELearningCourseType;
      setHasAlreadySubscribed(trainees?.includes(loggedUserId) || false);
    }
  }, [loggedUserId, program]);

  const goToCourse = () => navigation.navigate('LearnerCourseProfile', { courseId });

  const startActivity = () => {
    const firstActivity = get(program, 'subPrograms[0].steps[0].activities[0]') || null;
    navigation.dispatch(StackActions.replace('LearnerCourseProfile', { courseId }));
    navigation.navigate(
      'ActivityCardContainer',
      { activityId: firstActivity._id, profileId: courseId, mode: LEARNER }
    );
  };

  const subscribeAndGoToCourseProfile = async () => {
    try {
      if (!hasAlreadySubscribed) {
        await Courses.registerToELearningCourse(courseId);
        startActivity();
      } else goToCourse();
    } catch (e: any) {
      console.error(e);
    }
  };

  const buttonCaption = hasAlreadySubscribed ? 'Continuer' : 'Commencer';

  return (
    <About program={program} onPress={subscribeAndGoToCourseProfile} buttonCaption={buttonCaption} />
  );
};

const mapStateToProps = state => ({ loggedUserId: getLoggedUserId(state) });

export default connect(mapStateToProps)(ElearningAbout);
