/* eslint-env browser */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  ImageSourcePropType,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native';
import get from 'lodash/get';
import has from 'lodash/has';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';
import { Buffer } from 'buffer';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, RootBottomTabParamList } from '../../../../types/NavigationType';
import Courses from '../../../../api/courses';
import Questionnaires from '../../../../api/questionnaires';
import { WHITE, GREY } from '../../../../styles/colors';
import { ICON } from '../../../../styles/metrics';
import commonStyles from '../../../../styles/common';
import { CourseType, BlendedCourseType, ELearningProgramType } from '../../../../types/CourseTypes';
import styles from '../styles';
import { useGetLoggedUserId, useSetStatusBarVisible } from '../../../../store/main/hooks';
import { useSetCourse, useResetAttendanceSheetReducer } from '../../../../store/attendanceSheets/hooks';
import ProgressBar from '../../../../components/cards/ProgressBar';
import NiSecondaryButton from '../../../../components/form/SecondaryButton';
import PendingActionsContainer from '../../../../components/learnerPendingActions/PendingActionsContainer';
import { QuestionnaireType } from '../../../../types/QuestionnaireType';
import { getCourseProgress } from '../../../../core/helpers/utils';
import CourseProfileHeader from '../../../../components/CourseProfileHeader';
import { FIRA_SANS_MEDIUM } from '../../../../styles/fonts';
import { renderStepList, getTitle } from '../helper';
import { BLENDED, IS_IOS, IS_WEB, LEARNER, PEDAGOGY, SINGLE, TUTOR } from '../../../../core/data/constants';

interface LearnerCourseProfileProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'LearnerCourseProfile'>,
StackScreenProps<RootBottomTabParamList>
>{}

const LearnerCourseProfile = ({ route, navigation }: LearnerCourseProfileProps) => {
  const { mode = LEARNER } = route.params;
  const setStatusBarVisible = useSetStatusBarVisible();
  const userId: string | null = useGetLoggedUserId();
  const setCourseToStore = useSetCourse();
  const resetAttendanceSheetReducer = useResetAttendanceSheetReducer();

  const [course, setCourse] = useState<CourseType | null>(null);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireType[]>([]);
  const [source, setSource] =
    useState<ImageSourcePropType>(require('../../../../../assets/images/authentication_background_image.webp'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const attendanceSheetsToSign = useMemo(() =>
    (course?.type === SINGLE && mode === LEARNER
      ? (course as BlendedCourseType)?.attendanceSheets?.filter(as =>
        has(as, 'signatures.trainer') && !has(as, 'signatures.trainee')) || []
      : []),
  [course, mode]);

  const title = useMemo(() => getTitle(course), [course]);

  const isFocused = useIsFocused();
  useEffect(() => {
    const getCourse = async () => {
      try {
        const fetchedCourse = await Courses.getCourse(route.params.courseId, PEDAGOGY);
        if (mode === LEARNER) {
          if (fetchedCourse.type !== SINGLE) {
            const fetchedQuestionnaires = await Questionnaires.getUserQuestionnaires({ course: route.params.courseId });
            setQuestionnaires(fetchedQuestionnaires);
          }
          if (fetchedCourse.format === BLENDED) {
            const formattedCourse = {
              _id: fetchedCourse._id,
              subProgram: { steps: fetchedCourse.subProgram.steps.map(s => ({ _id: s._id, name: s.name })) },
            };
            setCourseToStore(formattedCourse as BlendedCourseType);
          }
        }
        const programImage = get(fetchedCourse, 'subProgram.program.image.link') || '';
        setCourse(fetchedCourse);
        if (programImage) setSource({ uri: programImage });
      } catch (e: any) {
        console.error(e);
        setCourse(null);
      }
    };

    if (isFocused) {
      setStatusBarVisible(true);
      getCourse();
    }
  }, [isFocused, setStatusBarVisible, route.params.courseId, setCourseToStore, mode]);

  useEffect(() => () => {
    const currentRoute = navigation.getState().routes[navigation.getState().index];
    if (currentRoute?.name !== 'UpdateAttendanceSheet') {
      resetAttendanceSheetReducer();
    }
  }, [navigation, resetAttendanceSheetReducer]);

  const goBack = useCallback(() => {
    navigation.navigate('LearnerCourses');
  }, [navigation]);

  const hardwareBackPress = useCallback(() => {
    goBack();
    return true;
  }, [goBack]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, [hardwareBackPress]);

  const getPdfName = (c: BlendedCourseType) => {
    const misc = c.misc ? `_${c.misc}` : '';

    return `attestation_${c.subProgram.program.name}${misc}`.replace(/[^a-zA-Zà-üÀ-Ü0-9-+]{1,}/g, '_');
  };

  const downloadCompletionCertificate = async () => {
    if (!course) return;

    setIsLoading(true);
    const data = await Courses.downloadCertificate(course._id);

    const buffer = Buffer.from(data, 'base64');
    const pdf = buffer.toString('base64');
    const pdfName = getPdfName(course as BlendedCourseType);

    if (!IS_WEB) {
      const fileUri = `${FileSystem.documentDirectory}${encodeURI(pdfName)}.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, pdf, { encoding: FileSystem.EncodingType.Base64 });

      if (IS_IOS) {
        await Sharing.shareAsync(fileUri);
      } else {
        FileSystem.getContentUriAsync(fileUri).then((cUri) => {
          IntentLauncher.startActivityAsync('android.intent.action.VIEW' as IntentLauncher.ActivityAction, {
            data: cUri,
            flags: 1,
          });
        });
      }
    } else if (typeof document !== 'undefined') {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setIsLoading(false);
  };

  const goToAbout = () => {
    if (!course) return;
    if (course.subProgram.isStrictlyELearning) {
      const { program } = course.subProgram;
      const eLearningProgram = {
        ...program,
        subPrograms: [{ ...course.subProgram, courses: [{ _id: course._id, trainees: [userId!] }] }],
      };
      navigation.navigate('ElearningAbout', { program: eLearningProgram as ELearningProgramType });
    } else {
      navigation.navigate('BlendedAbout', { course: course as BlendedCourseType, mode });
    }
  };

  const renderHeader = () => course && has(course, 'subProgram.program') && <>
    <CourseProfileHeader source={source} goBack={goBack} title={title} />
    <View style={styles.buttonsContainer}>
      <NiSecondaryButton caption='A propos' onPress={goToAbout} icon='info' borderColor={GREY[200]}
        bgColor={WHITE} font={FIRA_SANS_MEDIUM.LG} />
    </View>
    {!!(questionnaires.length || attendanceSheetsToSign.length) &&
          <PendingActionsContainer questionnaires={questionnaires} profileId={course._id}
            attendanceSheets={attendanceSheetsToSign} />
    }
    {[LEARNER, TUTOR].includes(mode) && <View style={styles.progressBarContainer}>
      <Text style={styles.progressBarText}>ÉTAPES</Text>
      <View style={commonStyles.progressBarContainer}>
        <ProgressBar progress={getCourseProgress(course) * 100} />
      </View>
      <Text style={styles.progressBarText}>{(getCourseProgress(course) * 100).toFixed(0)}%</Text>
    </View>}
  </>;

  const renderFooter = () => <View style={styles.buttonContainer}>
    {course?.areLastSlotAttendancesValidated &&
    <TouchableOpacity style={styles.buttonContent} onPress={downloadCompletionCertificate}
      disabled={isLoading}>
      {isLoading
        ? <ActivityIndicator color={WHITE} size="small" />
        : <View style={styles.certificateContent}>
          <Feather name='award' color={WHITE} size={ICON.MD} />
          <Text style={styles.certificateText}>Attestation</Text>
        </View>}
    </TouchableOpacity>}
  </View>;

  return course && has(course, 'subProgram.program') ? (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <FlatList data={course.subProgram.steps} keyExtractor={item => item._id} ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => renderStepList(mode, route, item, index)}
        showsVerticalScrollIndicator={IS_WEB} ListFooterComponent={renderFooter} />
    </SafeAreaView>
  )
    : <View style={commonStyles.loadingContainer}>
      <ActivityIndicator color={GREY[800]} size="small" />
    </View>;
};

export default LearnerCourseProfile;
