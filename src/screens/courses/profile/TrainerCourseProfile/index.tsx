// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  BackHandler,
  ImageSourcePropType,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native';
import get from 'lodash/get';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, RootBottomTabParamList } from '../../../../types/NavigationType';
import Courses from '../../../../api/courses';
import { WHITE, GREY } from '../../../../styles/colors';
import commonStyles from '../../../../styles/common';
import { HIT_SLOP } from '../../../../styles/metrics';
import { CourseType, BlendedCourseType } from '../../../../types/CourseTypes';
import styles from '../styles';
import { useSetStatusBarVisible } from '../../../../store/main/hooks';
import NiSecondaryButton from '../../../../components/form/SecondaryButton';
import CourseProfileHeader from '../../../../components/CourseProfileHeader';
import { FIRA_SANS_MEDIUM } from '../../../../styles/fonts';
import { getTitle, renderStepList } from '../helper';
import { PEDAGOGY, TRAINER } from '../../../../core/data/constants';

const ADMIN_SCREEN = 'AdminCourseProfile';
const ABOUT_SCREEN = 'BlendedAbout';

interface TrainerCourseProfileProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'TrainerCourseProfile'>,
StackScreenProps<RootBottomTabParamList>
> {
}

const TrainerCourseProfile = ({
  route,
  navigation,
}: TrainerCourseProfileProps) => {
  const setStatusBarVisible = useSetStatusBarVisible();

  const [course, setCourse] = useState<CourseType | null>(null);
  const [source, setSource] =
    useState<ImageSourcePropType>(require('../../../../../assets/images/authentication_background_image.webp'));
  const [title, setTitle] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isFocused = useIsFocused();

  const getCourse = useCallback(async () => {
    try {
      const fetchedCourse = await Courses.getCourse(route.params.courseId, PEDAGOGY);
      const programImage = get(fetchedCourse, 'subProgram.program.image.link') || '';

      if (!isEqual(fetchedCourse, course)) setCourse(fetchedCourse);
      setTitle(getTitle(fetchedCourse));
      if (programImage) setSource({ uri: programImage });
      setRefreshing(false);
      setIsLoaded(true);
    } catch (e: any) {
      console.error(e);
      setCourse(null);
    }
  }, [course, route.params.courseId]);

  useEffect(() => {
    if (isFocused) {
      setStatusBarVisible(true);
      if (!isLoaded) getCourse();
    }
  }, [isFocused, getCourse, setStatusBarVisible, isLoaded]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const hardwareBackPress = useCallback(() => {
    goBack();
    return true;
  }, [goBack]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, [hardwareBackPress, isFocused]);

  const goTo = (screen: typeof ABOUT_SCREEN | typeof ADMIN_SCREEN) => {
    if (!course) return;

    if (screen === ABOUT_SCREEN) navigation.navigate(screen, { course: course as BlendedCourseType, mode: TRAINER });
    else navigation.navigate(screen, { courseId: course._id });
  };

  const goToTraineeFile = (sheetId: string) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}`;
    Linking.openURL(url);
  };

  const renderHeader = () => <>
    <CourseProfileHeader source={source} goBack={goBack} title={title} />
    <View style={styles.buttonsContainer}>
      <NiSecondaryButton caption='Espace admin' onPress={() => goTo(ADMIN_SCREEN)} icon='folder' color={GREY[700]}
        customStyle={styles.adminButton} borderColor={GREY[200]} bgColor={GREY[200]} font={FIRA_SANS_MEDIUM.LG} />
      <NiSecondaryButton caption='A propos' onPress={() => goTo(ABOUT_SCREEN)} icon='info' borderColor={GREY[200]}
        bgColor={WHITE} font={FIRA_SANS_MEDIUM.LG} />
      {course.sheetId && <TouchableOpacity hitSlop={HIT_SLOP}
        onPress={() => goToTraineeFile(course.sheetId)} style={styles.fileLinkContainer}>
        <Text style={styles.traineeProgress}>Accéder au fichier de l&apos;apprenant</Text>
      </TouchableOpacity>}
    </View>
  </>;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCourse();
  }, [getCourse]);

  const renderRefreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  return course && has(course, 'subProgram.program') ? (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <FlatList data={course.subProgram.steps} keyExtractor={item => item._id} ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => renderStepList(TRAINER, route, item, index)}
        showsVerticalScrollIndicator={false} refreshControl={renderRefreshControl} />
    </SafeAreaView>
  )
    : <View style={commonStyles.loadingContainer}>
      <ActivityIndicator color={GREY[800]} size="small" />
    </View>;
};

export default TrainerCourseProfile;
