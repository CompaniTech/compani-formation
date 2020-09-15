import 'array-flat-polyfill';
import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import Courses from '../../api/courses';
import NextStepCell from '../../components/steps/NextStepCell';
import CourseCell from '../../components/CourseCell';
import { Context as AuthContext } from '../../context/AuthContext';
import moment from '../../core/helpers/moment';
import { getLoggedUserId } from '../../store/main/selectors';
import { MARGIN, MAIN_MARGIN_LEFT } from '../../styles/metrics';
import { PINK, YELLOW } from '../../styles/colors';
import commonStyles from '../../styles/common';
import { FIRA_SANS_BOLD } from '../../styles/fonts';
import { NavigationType } from '../../types/NavigationType';

interface CourseListProps {
  navigation: NavigationType,
  loggedUserId: string | null,
}

const formatFuturSlot = nextSlots => ({
  firstSlot: nextSlots[0].startDate,
  type: nextSlots[0].step.type,
  slots: groupBy(nextSlots, s => moment(s.startDate).format('DD/MM/YYYY')),
  _id: nextSlots[0]._id,
});

const formatCourseStep = (course) => {
  const courseSteps = get(course, 'subProgram.steps') || [];
  const stepSlots = groupBy(
    course.slots.filter(s => get(s, 'step._id')),
    s => s.step._id
  );
  const programName = get(course, 'subProgram.program.name');

  return Object.keys(stepSlots)
    .map((stepId) => {
      const nextSlots = stepSlots[stepId]
        .filter(slot => moment().isSameOrBefore(slot.startDate, 'days'))
        .sort((a, b) => moment(a.startDate).diff(b.startDate, 'days'));

      return nextSlots.length
        ? { name: programName, stepIndex: courseSteps.indexOf(stepId), ...formatFuturSlot(nextSlots) }
        : null;
    })
    .filter(step => !!step);
};

const formatNextSteps = courses => courses.map(formatCourseStep).flat()
  .filter(step => Object.keys(step.slots).length)
  .sort((a, b) => moment(a.firstSlot).diff(b.firstSlot, 'days'));

const CourseList = ({ navigation, loggedUserId }: CourseListProps) => {
  const [courses, setCourses] = useState(new Array(0));
  const { signOut } = useContext(AuthContext);

  const getCourses = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const fetchedCourses = await Courses.getUserCourses({ trainees: userId });
      setCourses(fetchedCourses);
    } catch (e) {
      if (e.status === 401) signOut();
      console.error(e);
      setCourses(() => []);
    }
  };

  useEffect(() => {
    console.log('loggedUserId', loggedUserId);
    async function fetchData() { getCourses(); }
    if (loggedUserId) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUserId]);

  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchData() { getCourses(); }
    if (isFocused) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const renderSeparator = () => <View style={styles.separator} />;
  const nextStep = formatNextSteps(courses);

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.title} testID='header'>Mes formations</Text>
      {nextStep.length > 0 &&
        <View style={styles.sectionContainer}>
          <View style={styles.contentTitle}>
            <Text style={commonStyles.sectionTitle}>Prochains évènements</Text>
            <View style={{ ...styles.nextEventsCountContainer, ...commonStyles.countContainer }}>
              <Text style={styles.coursesCount}>{nextStep.length}</Text>
            </View>
          </View>
          <FlatList
            horizontal
            data={nextStep}
            keyExtractor={item => item._id}
            renderItem={({ item }) => <NextStepCell nextSlotsStep={item} />}
            contentContainerStyle={styles.courseContainer}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={renderSeparator}
          />
        </View>
      }
      <View style={styles.sectionContainer}>
        <View style={styles.contentTitle}>
          <Text style={commonStyles.sectionTitle}>Formations en cours</Text>
          <View style={{ ...styles.coursesCountContainer, ...commonStyles.countContainer }}>
            <Text style={styles.nextEventsCount}>{courses.length}</Text>
          </View>
        </View>
        <FlatList
          horizontal
          data={courses}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <CourseCell course={item} navigation={navigation} />}
          contentContainerStyle={styles.courseContainer}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    paddingHorizontal: MAIN_MARGIN_LEFT,
  },
  separator: {
    marginRight: 8,
  },
  contentTitle: {
    flexDirection: 'row',
    marginBottom: MARGIN.MD,
  },
  sectionContainer: { position: 'relative', marginBottom: MARGIN.XXXL },
  coursesCountContainer: {
    backgroundColor: YELLOW[200],
  },
  coursesCount: {
    ...FIRA_SANS_BOLD.MD,
    color: YELLOW[800],
  },
  nextEventsCountContainer: {
    backgroundColor: PINK[100],
  },
  nextEventsCount: {
    ...FIRA_SANS_BOLD.MD,
    color: PINK[600],
  },
});

const mapStateToProps = state => ({ loggedUserId: getLoggedUserId(state) });

export default connect(mapStateToProps)(CourseList);
