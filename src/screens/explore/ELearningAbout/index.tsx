import get from 'lodash/get';
import { StackActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/NavigationType';
import Courses from '../../../api/courses';
import { useGetLoggedUserId } from '../../../store/main/hooks';
import { ELearningCourseType } from '../../../types/CourseTypes';
import About from '../../../components/About';
import { LEARNER } from '../../../core/data/constants';

interface ElearningAboutProps extends StackScreenProps<RootStackParamList, 'ElearningAbout'> {}

const ElearningAbout = ({ route, navigation }: ElearningAboutProps) => {
  const loggedUserId = useGetLoggedUserId();

  const { program } = route.params;
  const subProgram = program.subPrograms ? program.subPrograms[0] : null;
  const course = subProgram?.courses ? subProgram.courses[0] : null;
  const courseId = course?._id || '';
  const hasAlreadySubscribed = course && loggedUserId
    ? ((course as ELearningCourseType).trainees?.includes(loggedUserId) || false)
    : false;

  const goToCourse = () => navigation.popTo('LearnerCourseProfile', { courseId });

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

export default ElearningAbout;
