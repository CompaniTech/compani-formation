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
  useResetCourseData,
  useGetShouldRefreshSheets,
  useSetShouldRefreshSheets,
} from '../../../../store/attendanceSheets/hooks';

interface AdminCourseProfileProps extends StackScreenProps<RootStackParamList, 'TrainerCourseProfile'> {}

interface imagePreviewProps {
  visible: boolean,
  id: string,
  link: string,
  type: string,
  hasSlots: boolean,
  hasTrainee: boolean,
}

type QRCodeType = { img: string, courseTimeline: string };

// Helper function to build quick lookup maps for attendance sheets - O(1) lookups instead of O(n)
const buildAttendanceSheetMaps = (sheets: AttendanceSheetType[], courseType: string) => {
  const sheetsByTraineeId = new Map<string, InterAttendanceSheetType>();
  const slotsBySheetId = new Map<string, Set<string>>();

  sheets.forEach((sheet: any) => {
    if (courseType === INTER_B2B && sheet.trainee?._id) {
      sheetsByTraineeId.set(sheet.trainee._id, sheet);
      if (sheet.slots?.length) slotsBySheetId.set(sheet._id, new Set(sheet.slots.map((s: any) => s._id)));
    }
  });

  return { sheetsByTraineeId, slotsBySheetId };
};

// Helper function to build lookup sets for missing attendances
const buildMissingAttendanceMaps = (slots: SlotType[]) => {
  const missingAttendancesBySlotId = new Map<string, Set<string>>();
  const traineesBySlotId = new Map<string, Set<string>>();

  slots.forEach((slot) => {
    if (slot.missingAttendances?.length) {
      missingAttendancesBySlotId.set(slot._id, new Set(slot.missingAttendances.map(a => a.trainee)));
    }
    if (slot.trainees?.length) traineesBySlotId.set(slot._id, new Set(slot.trainees));
  });

  return { missingAttendancesBySlotId, traineesBySlotId };
};

const AdminCourseProfile = ({ route, navigation }: AdminCourseProfileProps) => {
  const course = useGetCourse();
  const setCourse = useSetCourse();
  const setMissingAttendanceSheet = useSetMissingAttendanceSheets();
  const setGroupedSlotsToBeSigned = useSetGroupedSlotsToBeSigned();
  const resetCourseData = useResetCourseData();
  const shouldRefreshSheets = useGetShouldRefreshSheets();
  const setShouldRefreshSheets = useSetShouldRefreshSheets();
  const [savedAttendanceSheets, setSavedAttendanceSheets] = useState<AttendanceSheetType[]>([]);
  const [completedAttendanceSheets, setCompletedAttendanceSheets] = useState<AttendanceSheetType[]>([]);
  const [firstSlot, setFirstSlot] = useState<SlotType | null>(null);
  const [noAttendancesMessage, setNoAttendancesMessage] = useState<string>('');
  const [imagePreview, setImagePreview] =
    useState<imagePreviewProps>({ visible: false, id: '', link: '', type: '', hasSlots: false, hasTrainee: false });
  const [questionnaireQRCodes, setQuestionnaireQRCodes] = useState<QRCodeType[]>([]);
  const [questionnairesType, setQuestionnairesType] = useState<string[]>([]);

  const isSingle = useMemo(() => course?.type === SINGLE, [course?.type]);
  const title = useMemo(() => (course ? getTitle(course) : ''), [course]);

  // Memoized lookup maps for faster computations - O(1) lookups instead of O(n)
  const attendanceSheetMaps = useMemo(() => buildAttendanceSheetMaps(savedAttendanceSheets, course?.type || ''),
    [savedAttendanceSheets, course]);
  const missingAttendanceMaps = useMemo(() => buildMissingAttendanceMaps(course?.slots || []), [course]);

  const groupedSlotsToBeSigned = useMemo(() => {
    if (!course?.slots.length || !course?.trainees?.length) return {};

    const { sheetsByTraineeId, slotsBySheetId } = attendanceSheetMaps;
    const { missingAttendancesBySlotId, traineesBySlotId } = missingAttendanceMaps;

    const slotList = course.slots.filter((slot) => {
      // Only check slots that are in the past
      if (!TODAY.isAfter(slot.startDate)) return false;

      return course.trainees!.some((trainee) => {
        // Check if trainee already has attendance sheet for this slot
        if (course.type === INTER_B2B) {
          const sheet = sheetsByTraineeId.get(trainee._id);
          if (sheet?.file) return false; // Sheet with file means complete
          if (sheet) {
            const sheetSlots = slotsBySheetId.get(sheet._id);
            if (sheetSlots?.has(slot._id)) return false;
          }
        } else if (isSingle) {
          // For SINGLE, if any saved sheet has this slot, skip it
          const isSlotAlreadySigned = savedAttendanceSheets.some(sheet => sheet.slots?.some(s => s._id === slot._id));
          if (isSlotAlreadySigned) return false;
        }

        // Check if trainee has missing attendance
        const missingAttendances = missingAttendancesBySlotId.get(slot._id);
        if (missingAttendances?.has(trainee._id)) return false;

        // Check if trainee is concerned by this slot
        const slotTrainees = traineesBySlotId.get(slot._id);
        return !slotTrainees || slotTrainees.has(trainee._id);
      });
    });

    const groupedSlots = groupBy(slotList, 'step');

    return course.subProgram.steps.reduce<Record<string, SlotType[]>>((acc, step) => {
      if (groupedSlots[step._id]) acc[step.name] = groupedSlots[step._id];
      return acc;
    }, {});
  }, [course, attendanceSheetMaps, missingAttendanceMaps, isSingle, savedAttendanceSheets]);

  // Memoize flattened slots to avoid repeated Object.values().flat() calls
  const flatGroupedSlots = useMemo(() => Object.values(groupedSlotsToBeSigned).flat(), [groupedSlotsToBeSigned]);

  const missingAttendanceSheets = useMemo(() => {
    if (!course?.slots?.length || !firstSlot) return [];

    if ([INTRA, INTRA_HOLDING].includes(course.type)) {
      const intraOrIntraHoldingCourseSavedSheets = savedAttendanceSheets as IntraOrIntraHoldingAttendanceSheetType[];
      const savedDatesSet = new Set(
        intraOrIntraHoldingCourseSavedSheets.map(sheet => CompaniDate(sheet.date).startOf('day').toISO())
      );

      return uniqBy(
        flatGroupedSlots
          .map(slot => ({
            value: CompaniDate(slot.startDate).startOf('day').toISO(),
            label: CompaniDate(slot.startDate).format(DD_MM_YYYY),
          }))
          .filter(date => !savedDatesSet.has(date.value) && TODAY.isSameOrAfter(date.value)),
        'value'
      );
    }

    if (TODAY.isBefore(firstSlot?.startDate!)) return [];

    if (isSingle) {
      if (flatGroupedSlots.length) {
        return course.trainees!
          .map(t => ({ value: t._id, label: formatIdentity(t.identity, LONG_FIRSTNAME_LONG_LASTNAME) }));
      }
      return [];
    }

    const { sheetsByTraineeId, slotsBySheetId } = attendanceSheetMaps;
    const { missingAttendancesBySlotId, traineesBySlotId } = missingAttendanceMaps;

    if (!flatGroupedSlots.length) return [];

    // Build set of past slots for quick lookup
    const pastSlotIds = new Set<string>();
    course.slots.forEach((s) => { if (TODAY.isSameOrAfter(s.startDate)) pastSlotIds.add(s._id); });

    return (course?.trainees || [])
      .filter((trainee) => {
        // Check if trainee is always missing in past slots
        const haveBeenPresentToPastSlot = Array.from(pastSlotIds).some((slotId) => {
          const missingAttendances = missingAttendancesBySlotId.get(slotId);
          return !missingAttendances?.has(trainee._id);
        });
        if (!haveBeenPresentToPastSlot) return false;

        const sheet = sheetsByTraineeId.get(trainee._id);
        if (!sheet) return true;
        if (sheet.file) return false;
        const sheetSlots = slotsBySheetId.get(sheet._id);

        // Check if there are slots to sign
        return flatGroupedSlots.some((slot) => {
          // Skip if sheet already contains the slot
          if (sheetSlots?.has(slot._id)) return false;
          // Skip if trainee is marked as missing
          const missingAttendances = missingAttendancesBySlotId.get(slot._id);
          if (missingAttendances?.has(trainee._id)) return false;
          // Check if trainee is concerned by the slot
          const sloTrainees = traineesBySlotId.get(slot._id);
          return !sloTrainees || sloTrainees.has(trainee._id);
        });
      })
      .map(t => ({ value: t._id, label: formatIdentity(t.identity, LONG_FIRSTNAME_LONG_LASTNAME) }));
  }, [
    course,
    firstSlot,
    isSingle,
    attendanceSheetMaps,
    missingAttendanceMaps,
    savedAttendanceSheets,
    flatGroupedSlots,
  ]);

  const refreshAttendanceSheets = useCallback(async (courseId: string) => {
    const fetchedAttendanceSheets = await AttendanceSheets.getAttendanceSheetList({ course: courseId });
    setSavedAttendanceSheets(fetchedAttendanceSheets);
    setCompletedAttendanceSheets(fetchedAttendanceSheets.filter(as => as.file));
  }, []);

  const getQuestionnaireQRCode = async (courseId: string) => {
    try {
      const publishedQuestionnaires = await Questionnaires.list({ course: courseId });
      const questionnairesTypeList = publishedQuestionnaires.map(q => q.type).sort(sortStrings);
      setQuestionnairesType(questionnairesTypeList);

      const qrCodes: QRCodeType[] = [];
      if (questionnairesTypeList.includes(EXPECTATIONS)) {
        const img = await Questionnaires.getQRCode({ course: courseId, courseTimeline: START_COURSE });
        qrCodes.push({ img, courseTimeline: START_COURSE });
      }
      if (questionnairesTypeList.includes(END_OF_COURSE)) {
        const img = await Questionnaires.getQRCode({ course: courseId, courseTimeline: END_COURSE });
        qrCodes.push({ img, courseTimeline: END_COURSE });
      }
      setQuestionnaireQRCodes(qrCodes);
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
        setCourse(fetchedCourse as BlendedCourseType);
      } catch (e: any) {
        console.error(e);
        setCourse(null);
      }
    };

    getCourse();
  }, [refreshAttendanceSheets, route.params.courseId, setCourse]);

  useEffect(() => {
    setMissingAttendanceSheet(missingAttendanceSheets);
    setGroupedSlotsToBeSigned(groupedSlotsToBeSigned);
  }, [missingAttendanceSheets, setMissingAttendanceSheet, groupedSlotsToBeSigned, setGroupedSlotsToBeSigned]);

  useEffect(() => () => {
    const currentRoute = navigation.getState().routes[navigation.getState().index];
    if (currentRoute?.name !== 'CreateAttendanceSheet') resetCourseData();
  }, [navigation, resetCourseData]);

  useFocusEffect(
    useCallback(() => {
      if (!course) return undefined;
      if (shouldRefreshSheets) {
        setShouldRefreshSheets(false);
        // Use setTimeout to defer heavy computation to next frame
        setTimeout(() => { refreshAttendanceSheets(course._id); }, 0);
      }
      return undefined;
    }, [course, shouldRefreshSheets, setShouldRefreshSheets, refreshAttendanceSheets])
  );

  useEffect(() => {
    if (!firstSlot) {
      setNoAttendancesMessage('Veuillez ajouter des créneaux pour téléverser des feuilles d\'émargement.');
    } else if (TODAY.isBefore(firstSlot.startDate)) {
      setNoAttendancesMessage('L\'émargement sera disponible une fois le premier créneau passé.');
    } else if (course?.type === INTER_B2B && !course?.trainees?.length) {
      setNoAttendancesMessage('Veuillez ajouter des stagiaires pour émarger la formation.');
    } else if (savedAttendanceSheets.length && !completedAttendanceSheets.length) {
      setNoAttendancesMessage('Toutes les feuilles d\'émargement sont en attente de signature du stagiaire.');
    }
  }, [completedAttendanceSheets, course, firstSlot, savedAttendanceSheets]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const hardwareBackPress = useCallback(() => {
    goBack();
    return true;
  }, [goBack]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);
    return () => { subscription.remove(); };
  }, [hardwareBackPress]);

  const renderTrainee = useCallback((person: TraineeType) => <PersonCell key={person._id} person={person} />, []);

  const deleteAttendanceSheets = async (shouldDeleteAttendances: boolean) => {
    try {
      await AttendanceSheets.delete(imagePreview.id, { shouldDeleteAttendances });
      await refreshAttendanceSheets(course?._id!);
      if (shouldDeleteAttendances) {
        const fetchedCourse = await Courses.getCourse(route.params.courseId, OPERATIONS) as BlendedCourseType;
        setCourse(fetchedCourse as BlendedCourseType);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openImagePreview = useCallback(async (sheet: AttendanceSheetType) => {
    const { _id: id, file, slots } = sheet;
    const hasSlots = !!slots;
    const hasTrainee = 'trainee' in sheet;
    await new Promise<void>((resolve) => {
      Image.getSize(
        file.link || '',
        () => {
          setImagePreview({ visible: true, id, link: file.link || '', type: IMAGE, hasSlots, hasTrainee });
          resolve();
        },
        () => {
          setImagePreview({ visible: true, id, link: file.link || '', type: PDF, hasSlots, hasTrainee });
          resolve();
        }
      );
    });
  }, []);

  const resetImagePreview = useCallback(() =>
    setImagePreview({ visible: false, id: '', link: '', type: '', hasSlots: false, hasTrainee: false }),
  []);

  const renderSavedAttendanceSheets = useCallback((sheet: AttendanceSheetType) => {
    const label = isIntraOrIntraHolding(sheet)
      ? CompaniDate(sheet.date).format(DD_MM_YYYY)
      : formatIdentity(sheet.trainee.identity, SHORT_FIRSTNAME_LONG_LASTNAME);

    return (
      <View key={sheet._id} style={styles.savedSheetContent}>
        <TouchableOpacity onPress={() => openImagePreview(sheet)}>
          <Feather name='file-text' size={ICON.XXL} color={GREY[900]} />
          <View style={styles.editButton}><Feather name='edit-2' size={ICON.SM} color={PINK[500]} /></View>
        </TouchableOpacity>
        <Text style={styles.savedSheetText} numberOfLines={2}>{label}</Text>
      </View>
    );
  },
  [openImagePreview]);

  const renderSingleSavedAttendanceSheets = useCallback((sheet: SingleAttendanceSheetType) => {
    const label = sheet.slots
      ? [...new Set(sheet.slots.map(slot => CompaniDate(slot.startDate).format(DD_MM_YYYY)))].join(', ')
      : formatIdentity(sheet.trainee.identity, SHORT_FIRSTNAME_LONG_LASTNAME);

    return (
      <SecondaryButton key={sheet._id} customStyle={styles.attendanceSheetButton} caption={label} numberOfLines={1}
        onPress={() => openImagePreview(sheet)} />
    );
  }, [openImagePreview]);

  const goToAttendanceSheetUpload = useCallback(() =>
    navigation.navigate('CreateAttendanceSheet', { isSingle }), [navigation, isSingle]);

  const renderQuestionnaireCell = useCallback((item: QRCodeType) => {
    const types = questionnairesType
      .filter(qType => (item.courseTimeline === START_COURSE ? qType !== END_OF_COURSE : qType !== EXPECTATIONS));

    return <QuestionnaireQRCodeCell img={item.img} types={types} courseId={course!._id}
      courseTimeline={item.courseTimeline} />;
  }, [course, questionnairesType]);

  const hasCompletedSheets = !!completedAttendanceSheets.length;
  const hasMissingSheets = !!missingAttendanceSheets.length;

  return course && has(course, 'subProgram.program') ? (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CourseAboutHeader screenTitle="ESPACE INTERVENANT" courseTitle={title} goBack={goBack} />
        <View style={styles.attendancesContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>Emargements</Text>
            {!hasMissingSheets && !hasCompletedSheets && <Text style={styles.italicText}>{noAttendancesMessage}</Text>}
          </View>
          {hasMissingSheets && !course.archivedAt && <View style={styles.uploadContainer}>
            <Text style={styles.header}>
              Pour charger une feuille d&apos;émargement ou envoyer une demande de signature veuillez cliquer sur le
              bouton ci-dessous.
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
          {hasCompletedSheets && (isSingle
            ? (completedAttendanceSheets as SingleAttendanceSheetType[]).map(renderSingleSavedAttendanceSheets)
            : <FlatList data={completedAttendanceSheets} keyExtractor={item => item._id}
              style={styles.listContainer}
              showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderSavedAttendanceSheets(item)}
              horizontal />
          )}
        </View>
        <View style={styles.sectionContainer}>
          <View style={commonStyles.sectionDelimiter} />
          <Text style={styles.sectionTitle}>Stagiaires</Text>
          {!course.trainees?.length &&
            <Text style={styles.italicText}>Il n&apos;y a aucun stagiaire pour cette formation.</Text>
          }
          {course.trainees?.map(renderTrainee)}
        </View>
        {!!questionnaireQRCodes.length && <View style={styles.sectionContainer}>
          <View style={commonStyles.sectionDelimiter} />
          <Text style={styles.sectionTitle}>Questionnaires</Text>
          <FlatList data={questionnaireQRCodes} keyExtractor={(item, idx) => `qrcode_${idx}`} scrollEnabled={false}
            renderItem={({ item }) => renderQuestionnaireCell(item)} showsHorizontalScrollIndicator={false} />
        </View>}
        {course.type !== INTER_B2B && <View style={styles.sectionContainer}>
          <View style={commonStyles.sectionDelimiter} />
          <ContactInfoContainer contact={course.companyRepresentative} title={'Votre chargé de formation structure'} />
        </View>}
        <View style={styles.footer} />
      </ScrollView>
      {imagePreview.visible && <ImagePreview source={pick(imagePreview, ['link', 'type', 'hasSlots', 'hasTrainee'])}
        onRequestClose={resetImagePreview} deleteFile={deleteAttendanceSheets} showButton={!course.archivedAt} />}
    </SafeAreaView>
  )
    : <View style={commonStyles.loadingContainer}>
      <ActivityIndicator color={GREY[800]} size="small" />
    </View>;
};

export default AdminCourseProfile;
