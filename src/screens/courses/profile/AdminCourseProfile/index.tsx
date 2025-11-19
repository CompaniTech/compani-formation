import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  BackHandler,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import pick from 'lodash/pick';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../../types/NavigationType';
import Courses from '../../../../api/courses';
import AttendanceSheets from '../../../../api/attendanceSheets';
import Questionnaires from '../../../../api/questionnaires';
import commonStyles from '../../../../styles/common';
import { ICON } from '../../../../styles/metrics';
import { BLACK, GREY, PINK, YELLOW } from '../../../../styles/colors';
import { BlendedCourseType, SlotType, TraineeType } from '../../../../types/CourseTypes';
import styles from './styles';
import { getTitle } from '../helper';
import CourseAboutHeader from '../../../../components/CourseAboutHeader';
import {
  DD_MM_YYYY,
  IMAGE,
  INTRA,
  INTER_B2B,
  INTRA_HOLDING,
  LONG_FIRSTNAME_LONG_LASTNAME,
  OPERATIONS,
  PDF,
  SHORT_FIRSTNAME_LONG_LASTNAME,
  EXPECTATIONS,
  END_OF_COURSE,
  START_COURSE,
  END_COURSE,
  TODAY,
  SINGLE,
} from '../../../../core/data/constants';
import CompaniDate from '../../../../core/helpers/dates/companiDates';
import PersonCell from '../../../../components/PersonCell';
import ContactInfoContainer from '../../../../components/ContactInfoContainer';
import {
  AttendanceSheetType,
  InterAttendanceSheetType,
  IntraOrIntraHoldingAttendanceSheetType,
  isIntraOrIntraHolding,
  SingleAttendanceSheetType,
} from '../../../../types/AttendanceSheetTypes';
import SecondaryButton from '../../../../components/form/SecondaryButton';
import { formatIdentity, sortStrings } from '../../../../core/helpers/utils';
import ImagePreview from '../../../../components/ImagePreview';
import QuestionnaireQRCodeCell from '../../../../components/QuestionnaireQRCodeCell';
import {
  useGetCourse,
  useSetCourse,
  useSetMissingAttendanceSheets,
  useSetGroupedSlotsToBeSigned,
  useResetAttendanceSheetReducer,
} from '../../../../store/attendanceSheets/hooks';

interface AdminCourseProfileProps extends StackScreenProps<RootStackParamList, 'TrainerCourseProfile'> {
}

interface imagePreviewProps {
  visible: boolean,
  id: string,
  link: string,
  type: string,
  hasSlots: boolean,
}

type QRCodeType = { img: string, courseTimeline: string };

const AdminCourseProfile = ({ route, navigation }: AdminCourseProfileProps) => {
  const course = useGetCourse();
  const setCourse = useSetCourse();
  const setMissingAttendanceSheet = useSetMissingAttendanceSheets();
  const setGroupedSlotsToBeSigned = useSetGroupedSlotsToBeSigned();
  const resetAttendanceSheetReducer = useResetAttendanceSheetReducer();
  const [isSingle, setIsSingle] = useState<boolean>(false);
  const [savedAttendanceSheets, setSavedAttendanceSheets] = useState<AttendanceSheetType[]>([]);
  const [completedAttendanceSheets, setCompletedAttendanceSheets] = useState<AttendanceSheetType[]>([]);
  const [title, setTitle] = useState<string>('');
  const [firstSlot, setFirstSlot] = useState<SlotType | null>(null);
  const [noAttendancesMessage, setNoAttendancesMessage] = useState<string>('');

  const groupedSlotsToBeSigned = useMemo(() => {
    if (!course?.slots.length) return {};
    const slotList = course.slots.filter(slot =>
      course.trainees?.some((trainee) => {
        if (course.type === INTER_B2B) {
          const asWithSlot = (savedAttendanceSheets as InterAttendanceSheetType[])
            .find(as => as.trainee._id === trainee._id && (as.slots?.some(s => s._id === slot._id) || as.file));
          if (asWithSlot) return false;
        } else if (course.type === SINGLE) {
          const asWithSlot = (savedAttendanceSheets)
            .find(as => as.slots?.some(s => s._id === slot._id));
          if (asWithSlot) return false;
        }

        const missingAttendance = slot.missingAttendances?.some(a => a.trainee === trainee._id);
        if (missingAttendance) return false;

        return true;
      }));

    const groupedSlots = groupBy(slotList.filter(slot => CompaniDate().isAfter(slot.startDate)), 'step');

    return course?.subProgram.steps.reduce<Record<string, SlotType[]>>((acc, step) => {
      if (groupedSlots[step._id]) acc[step.name] = groupedSlots[step._id];
      return acc;
    }, {});
  }, [course, savedAttendanceSheets]);

  const missingAttendanceSheets = useMemo(() => {
    if (!course?.slots?.length || !firstSlot) return [];

    if ([INTRA, INTRA_HOLDING].includes(course?.type)) {
      const intraOrIntraHoldingCourseSavedSheets = savedAttendanceSheets as IntraOrIntraHoldingAttendanceSheetType[];
      const savedDates = intraOrIntraHoldingCourseSavedSheets
        .map(sheet => CompaniDate(sheet.date).startOf('day').toISO());

      return uniqBy(
        Object.values(groupedSlotsToBeSigned).flat()
          .map(slot => ({
            value: CompaniDate(slot.startDate).startOf('day').toISO(),
            label: CompaniDate(slot.startDate).format(DD_MM_YYYY),
          }))
          .filter(date => !savedDates.includes(date.value) && TODAY.isSameOrAfter(date.value)),
        'value'
      );
    }

    if (TODAY.isBefore(firstSlot?.startDate!)) return [];

    if (isSingle) {
      if (Object.values(groupedSlotsToBeSigned).flat().length) {
        return course.trainees!
          .map(t => ({ value: t._id, label: formatIdentity(t.identity, LONG_FIRSTNAME_LONG_LASTNAME) }));
      }
      return [];
    }

    const interCourseSavedSheets = savedAttendanceSheets.filter(as => as.file) as InterAttendanceSheetType[];
    const savedTrainees = interCourseSavedSheets.map(sheet => sheet.trainee?._id);

    return Object.values(groupedSlotsToBeSigned).flat().length
      ? [...new Set(
        course?.trainees?.filter(trainee => (!savedTrainees.includes(trainee._id)))
          .map(t => ({ value: t._id, label: formatIdentity(t.identity, LONG_FIRSTNAME_LONG_LASTNAME) }))
      )]
      : [];
  }, [course, firstSlot, isSingle, savedAttendanceSheets, groupedSlotsToBeSigned]);

  const [imagePreview, setImagePreview] =
    useState<imagePreviewProps>({ visible: false, id: '', link: '', type: '', hasSlots: false });
  const [questionnaireQRCodes, setQuestionnaireQRCodes] = useState<QRCodeType[]>([]);
  const [questionnairesType, setQuestionnairesType] = useState<string[]>([]);

  const refreshAttendanceSheets = async (courseId: string) => {
    const fetchedAttendanceSheets = await AttendanceSheets.getAttendanceSheetList({ course: courseId });
    setSavedAttendanceSheets(fetchedAttendanceSheets);
    setCompletedAttendanceSheets(fetchedAttendanceSheets.filter(as => !!as.file));
  };

  const getQuestionnaireQRCode = async (courseId: string) => {
    try {
      const publishedQuestionnaires = await Questionnaires.list({ course: courseId });
      const questionnairesTypeList = publishedQuestionnaires.map(q => q.type).sort((a, b) => sortStrings(a, b));
      setQuestionnairesType(questionnairesTypeList);

      const qrCodes = [];
      if (publishedQuestionnaires.length) {
        if (questionnairesTypeList.includes(EXPECTATIONS)) {
          const img = await Questionnaires.getQRCode({ course: courseId, courseTimeline: START_COURSE });
          qrCodes.push({ img, courseTimeline: START_COURSE });
        }
        if (questionnairesTypeList.includes(END_OF_COURSE)) {
          const img = await Questionnaires.getQRCode({ course: courseId, courseTimeline: END_COURSE });
          qrCodes.push({ img, courseTimeline: END_COURSE });
        }

        setQuestionnaireQRCodes(qrCodes);
      }
    } catch (e: any) {
      console.error(e);
      setQuestionnaireQRCodes([]);
    }
  };

  useEffect(() => {
    const getCourse = async () => {
      try {
        const fetchedCourse = await Courses.getCourse(route.params.courseId, OPERATIONS) as BlendedCourseType;
        await Promise.all([
          refreshAttendanceSheets(fetchedCourse._id),
          ...(fetchedCourse.type !== SINGLE ? [getQuestionnaireQRCode(fetchedCourse._id)] : []),
        ]);

        if (fetchedCourse.slots.length) setFirstSlot(fetchedCourse.slots[0]);
        setTitle(getTitle(fetchedCourse));
        setIsSingle(fetchedCourse.type === SINGLE);
        setCourse(fetchedCourse as BlendedCourseType);
      } catch (e: any) {
        console.error(e);
        setCourse(null);
      }
    };

    getCourse();
  }, [route.params.courseId, setCourse]);

  useEffect(() => {
    setMissingAttendanceSheet(missingAttendanceSheets);
    setGroupedSlotsToBeSigned(groupedSlotsToBeSigned);
  }, [missingAttendanceSheets, setMissingAttendanceSheet, groupedSlotsToBeSigned, setGroupedSlotsToBeSigned]);

  useEffect(() => () => {
    const currentRoute = navigation.getState().routes[navigation.getState().index];
    if (currentRoute?.name !== 'CreateAttendanceSheet') {
      resetAttendanceSheetReducer();
    }
  }, [navigation, resetAttendanceSheetReducer]);

  useFocusEffect(
    useCallback(() => {
      if (course) refreshAttendanceSheets(course._id);
    }, [course])
  );

  useEffect(() => {
    if (!firstSlot) {
      setNoAttendancesMessage('Veuillez ajouter des créneaux pour téléverser des feuilles d\'émargement.');
    } else if (TODAY.isBefore(firstSlot.startDate)) {
      setNoAttendancesMessage('L\'émargement sera disponible une fois le premier créneau passé.');
    } else if (course?.type === INTER_B2B && !course?.trainees?.length) {
      setNoAttendancesMessage('Veuillez ajouter des stagiaires pour émarger la formation.');
    } else if (!!savedAttendanceSheets.length && !completedAttendanceSheets.length) {
      setNoAttendancesMessage('Toutes les feuilles d\'émargement sont en attente de signature du stagiaire.');
    }
  }, [completedAttendanceSheets, course, firstSlot, savedAttendanceSheets]);

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
  }, [hardwareBackPress]);

  const renderTrainee = (person: TraineeType) => <PersonCell person={person} />;

  const deleteAttendanceSheets = async (shouldDeleteAttendances: boolean) => {
    try {
      await AttendanceSheets.delete(imagePreview.id, { shouldDeleteAttendances });
      await refreshAttendanceSheets(course?._id!);
    } catch (error) {
      console.error(error);
    }
  };

  const openImagePreview = async (id: string, link: string, hasSlots: boolean) => {
    await new Promise(() => {
      Image.getSize(
        link || '',
        (image) => { setImagePreview({ visible: true, id, link: link || '', type: image ? IMAGE : PDF, hasSlots }); },
        () => setImagePreview({ visible: true, id, link, type: PDF, hasSlots })
      );
    });
  };

  const resetImagePreview = () => setImagePreview({ visible: false, id: '', link: '', type: '', hasSlots: false });

  const renderSavedAttendanceSheets = (sheet: AttendanceSheetType) => {
    const label = isIntraOrIntraHolding(sheet)
      ? CompaniDate(sheet.date).format(DD_MM_YYYY)
      : formatIdentity(sheet.trainee.identity, SHORT_FIRSTNAME_LONG_LASTNAME);

    return (
      <View key={sheet._id} style={styles.savedSheetContent}>
        <TouchableOpacity onPress={() => openImagePreview(sheet._id, sheet.file.link, !!sheet.slots)}>
          <Feather name='file-text' size={ICON.XXL} color={GREY[900]} />
          <View style={styles.editButton}><Feather name='edit-2' size={ICON.SM} color={PINK[500]} /></View>
        </TouchableOpacity>
        <Text style={styles.savedSheetText} numberOfLines={2}>{label}</Text>
      </View>);
  };

  const renderSingleSavedAttendanceSheets = (sheet: SingleAttendanceSheetType) => {
    const label = sheet.slots
      ? [...new Set(sheet.slots.map(slot => CompaniDate(slot.startDate).format(DD_MM_YYYY)))].join(', ')
      : formatIdentity(sheet.trainee.identity, SHORT_FIRSTNAME_LONG_LASTNAME);

    return (
      <SecondaryButton key={sheet._id} customStyle={styles.attendanceSheetButton} caption={label} numberOfLines={1}
        onPress={() => openImagePreview(sheet._id, sheet.file.link, !!sheet.slots)} />
    );
  };

  const goToAttendanceSheetUpload = () => navigation.navigate('CreateAttendanceSheet', { isSingle });

  const renderQuestionnaireCell = (item: QRCodeType) => {
    const types = questionnairesType
      .filter(qType => (item.courseTimeline === START_COURSE ? qType !== END_OF_COURSE : qType !== EXPECTATIONS));

    return <QuestionnaireQRCodeCell img={item.img} types={types} courseId={course!._id}
      courseTimeline={item.courseTimeline}/>;
  };

  return course && has(course, 'subProgram.program') ? (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CourseAboutHeader screenTitle="ESPACE INTERVENANT" courseTitle={title} goBack={goBack} />
        <View style={styles.attendancesContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Emargements</Text>
            {!missingAttendanceSheets.length && !completedAttendanceSheets.length &&
              <Text style={styles.italicText}>{noAttendancesMessage}</Text>}
          </View>
          {!!missingAttendanceSheets.length && !course.archivedAt && <View style={styles.uploadContainer}>
            <Text style={styles.header}>
              {
                'Pour charger une feuille d\'émargement ou envoyer une demande de signature veuillez cliquer sur le '
              + 'bouton ci-dessous.'
              }
            </Text>
            <View style={styles.sectionContainer}>
              <SecondaryButton caption={'Emarger des créneaux'} onPress={goToAttendanceSheetUpload}
                customStyle={styles.uploadButton} bgColor={course?.companies?.length ? YELLOW[300] : YELLOW[200]}
                disabled={!course?.companies?.length} color={course?.companies?.length ? BLACK : GREY[600]} />
              {!course.companies?.length &&
                <Text style={styles.italicText}>
                  Au moins une structure doit être rattachée à la formation pour pouvoir ajouter une feuille
                  d&apos;émargement.
                </Text>
              }
            </View>
          </View>}
          {!!completedAttendanceSheets.length && <>
            {
              isSingle
                ? (completedAttendanceSheets as SingleAttendanceSheetType[])
                  .map(sheet => renderSingleSavedAttendanceSheets(sheet))
                : <FlatList data={completedAttendanceSheets} keyExtractor={item => item._id}
                  style={styles.listContainer}
                  showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderSavedAttendanceSheets(item)}
                  horizontal/>
            }
          </>}
        </View>
        <View style={styles.sectionContainer}>
          <View style={commonStyles.sectionDelimiter} />
          <Text style={styles.sectionTitle}>Stagiaires</Text>
          {!course.trainees?.length &&
          <Text style={styles.italicText}>Il n&apos;y a aucun stagiaire pour cette formation.</Text>
          }
          {!!course.trainees && course.trainees.map(item => <View key={item._id}>{renderTrainee(item)}</View>)}
        </View>
        {!!questionnaireQRCodes.length && <View style={styles.sectionContainer}>
          <View style={commonStyles.sectionDelimiter} />
          <Text style={styles.sectionTitle}>Questionnaires</Text>
          <FlatList data={questionnaireQRCodes} keyExtractor={(item, idx) => `qrcode_${idx}`} scrollEnabled={false}
            renderItem={({ item }) => renderQuestionnaireCell(item)}
            showsHorizontalScrollIndicator={false} />
        </View>}
        {course.type !== INTER_B2B && <View style={styles.sectionContainer}>
          <View style={commonStyles.sectionDelimiter} />
          <ContactInfoContainer contact={course.companyRepresentative}
            title={'Votre chargé de formation structure'} />
        </View>}
        <View style={styles.footer} />
      </ScrollView>
      {imagePreview.visible && <ImagePreview source={pick(imagePreview, ['link', 'type', 'hasSlots'])}
        onRequestClose={resetImagePreview} deleteFile={deleteAttendanceSheets} showButton={!course.archivedAt}/>}
    </SafeAreaView>
  )
    : <View style={commonStyles.loadingContainer}>
      <ActivityIndicator color={GREY[800]} size="small" />
    </View>;
};

export default AdminCourseProfile;
