import 'array-flat-polyfill';
import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Text, View, ImageBackground, FlatList, RefreshControl, TextInput } from 'react-native';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import get from 'lodash/get';
import escapeRegExp from 'lodash/escapeRegExp';
import Courses from '../../../../api/courses';
import CoursesSection, { EVENT_SECTION } from '../../../../components/CoursesSection';
import NextStepCell from '../../../../components/steps/NextStepCell';
import ProgramCell from '../../../../components/ProgramCell';
import HomeScreenFooter from '../../../../components/HomeScreenFooter';
import { getTheoreticalDuration, removeDiacritics } from '../../../../core/helpers/utils';
import { BlendedCourseType } from '../../../../types/CourseTypes';
import { NextSlotsStepType } from '../../../../types/StepTypes';
import { RootBottomTabParamList, RootStackParamList } from '../../../../types/NavigationType';
import { OperationsCourseListResponseType } from '../../../../types/AxiosTypes';
import { useGetLoggedUserId } from '../../../../store/main/hooks';
import commonStyles from '../../../../styles/common';
import { GREY } from '../../../../styles/colors';
import {
  BLENDED,
  COMPLETED,
  FORTHCOMING,
  OPERATIONS,
  TRAINER,
} from '../../../../core/data/constants';
import styles from '../styles';
import { getElearningSteps, getCourseStatus } from '../helper';
import { CourseDisplayType } from '../types';
import TrainerEmptyState from '../TrainerEmptyState';

const formatCoursesDiplaysContent = (courses: BlendedCourseType[]) => {
  const coursesInProgress: BlendedCourseType[] = [];
  const forthcomingCourses: BlendedCourseType[] = [];
  const completedCourses: BlendedCourseType[] = [];

  courses.forEach((course) => {
    const status = getCourseStatus(course);
    switch (status) {
      case FORTHCOMING:
        forthcomingCourses.push(course);
        break;
      case COMPLETED:
        completedCourses.push(course);
        break;
      default:
        coursesInProgress.push(course);
        break;
    }
  });

  const contents: CourseDisplayType[] = [
    {
      title: 'En cours',
      source: require('../../../../../assets/images/yellow_section_background.webp'),
      imageStyle: styles.leftBackground,
      countStyle: styles.yellowCount,
      courses: coursesInProgress,
    },
    {
      title: 'À venir',
      source: require('../../../../../assets/images/purple_section_background.webp'),
      imageStyle: styles.rightBackground,
      countStyle: styles.purpleCount,
      courses: forthcomingCourses,
    },
    {
      title: 'Terminées',
      source: require('../../../../../assets/images/green_section_background.webp'),
      imageStyle: styles.leftBackground,
      countStyle: styles.greenCount,
      courses: completedCourses,
    },
  ];

  return contents.filter(section => section.courses.length);
};

const renderNextStepsItem = (step: NextSlotsStepType) => <NextStepCell nextSlotsStep={step} mode={TRAINER} />;

const inputStyle = { ...commonStyles.searchInput, ...styles.input };
type TrainerCoursesHeaderProps = { answer: string, setAnswer: (v: string) => void, nextSteps: NextSlotsStepType[] };
const TrainerCoursesHeader = memo(({ answer, setAnswer, nextSteps }: TrainerCoursesHeaderProps) => (
  <>
    <Text style={commonStyles.title} testID='header'>Espace intervenant</Text>
    {!!nextSteps.length && <View style={styles.nextSteps}>
      <CoursesSection items={nextSteps} title="Les prochaines sessions que j'anime"
        countStyle={styles.purpleCount} renderItem={renderNextStepsItem} type={EVENT_SECTION} />
    </View>
    }
    <TextInput placeholder="Chercher une formation" value={answer} onChangeText={setAnswer} clearButtonMode='always'
      style={!answer ? [inputStyle, commonStyles.placeholder] : inputStyle} placeholderTextColor={GREY[600]} />
  </>
));

interface TrainerCoursesProps extends CompositeScreenProps<
StackScreenProps<RootBottomTabParamList>,
StackScreenProps<RootStackParamList>
> {}

const TrainerCourses = ({ navigation }: TrainerCoursesProps) => {
  const loggedUserId = useGetLoggedUserId();

  const [coursesDisplays, setCoursesDisplays] = useState<CourseDisplayType[]>([]);
  const [nextSteps, setNextSteps] = useState<NextSlotsStepType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [answer, setAnswer] = useState<string>('');

  const isFocused = useIsFocused();

  const filteredCoursesDisplays = useMemo(() => {
    if (!answer) return coursesDisplays;

    const normalizedAnswer = escapeRegExp(removeDiacritics(answer.toLowerCase()));

    return coursesDisplays
      .map(section => ({
        ...section,
        courses: section.courses.filter((course) => {
          const courseName = escapeRegExp(
            removeDiacritics(
              `${course.subProgram.program.name?.toLowerCase()}${course.misc ? ` - ${course.misc.toLowerCase()}` : ''}`
            )
          );

          return courseName.includes(normalizedAnswer);
        }),
      }))
      .filter(section => section.courses.length);
  }, [answer, coursesDisplays]);

  const getCourses = useCallback(async () => {
    try {
      if (loggedUserId) {
        const fetchedCourses = await Courses.getCourseList({
          action: OPERATIONS,
          format: BLENDED,
          trainer: loggedUserId,
        });
        const formatedCourses = formatCoursesDiplaysContent(
          (fetchedCourses as OperationsCourseListResponseType).courses
        );
        setCoursesDisplays(formatedCourses);
        setNextSteps(fetchedCourses.nextSteps);
        setRefreshing(false);
        setIsLoaded(true);
      }
    } catch (e: any) {
      console.error(e);
      setCoursesDisplays([]);
    }
  }, [loggedUserId]);

  const goToCourse = (id: string) => {
    navigation.navigate('TrainerCourseProfile', { courseId: id });
  };

  const renderItem = (course: BlendedCourseType) => <ProgramCell program={get(course, 'subProgram.program') || {}}
    misc={course.misc} theoreticalDuration={getTheoreticalDuration(getElearningSteps(get(course, 'subProgram.steps')))}
    onPress={() => goToCourse(course._id)} />;

  useEffect(() => {
    if (isFocused) {
      if (!isLoaded) getCourses();
    } else setAnswer('');
  }, [isFocused, getCourses, loggedUserId, isLoaded]);

  const renderFooter = () => (!!coursesDisplays.length &&
    <HomeScreenFooter source={require('../../../../../assets/images/pa_aidant_balade_bleu.webp')} />
  );

  const renderCourseDisplay = (content: CourseDisplayType) =>
    <ImageBackground imageStyle={content.imageStyle} style={styles.sectionContainer}
      key={content.title} source={content.source}>
      <CoursesSection items={content.courses} title={content.title}
        countStyle={content.countStyle} renderItem={renderItem} />
    </ImageBackground>;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCourses();
  }, [getCourses]);

  const renderRefreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  return (
    <SafeAreaView style={commonStyles.container} edges={[]}>
      <View style={styles.container}>
        <FlatList data={filteredCoursesDisplays} keyExtractor={item => item.title}
          ListHeaderComponent={<TrainerCoursesHeader answer={answer} setAnswer={setAnswer} nextSteps={nextSteps} />}
          renderItem={({ item }) => renderCourseDisplay(item)} showsVerticalScrollIndicator={false}
          ListEmptyComponent={<TrainerEmptyState />} ListFooterComponent={renderFooter}
          refreshControl={renderRefreshControl} />
      </View>
    </SafeAreaView>
  );
};

export default TrainerCourses;
