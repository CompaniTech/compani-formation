import { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { StackScreenProps } from '@react-navigation/stack';
import get from 'lodash/get';
import { RootStackParamList } from '../../../types/NavigationType';
import About from '../../../components/About';
import styles from './styles';
import { formatQuantity } from '../../../core/helpers/utils';
import commonStyles, { markdownStyle } from '../../../styles/common';
import InternalRulesModal from '../../../components/InternalRulesModal';
import ContactInfoContainer from '../../../components/ContactInfoContainer';
import { LEARNER, TUTOR } from '../../../core/data/constants';
import InterlocutorCell from '../../../components/InterlocutorCell';
import { TrainerType, TutorType } from '../../../types/CourseTypes';

interface BlendedAboutProps extends StackScreenProps<RootStackParamList, 'BlendedAbout'> {}

const BlendedAbout = ({ route, navigation }: BlendedAboutProps) => {
  const { course, mode } = route.params;
  const program = course.subProgram?.program || null;
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

  const goToCourse = () => {
    if (course._id) {
      if ([LEARNER, TUTOR].includes(mode)) navigation.navigate('LearnerCourseProfile', { courseId: course._id, mode });
      else navigation.navigate('TrainerCourseProfile', { courseId: course._id });
    }
  };

  return program && (
    <About program={program} onPress={goToCourse}>
      <View style={styles.content}>
        {course.slots.length > 0 &&
          <>
            <View style={commonStyles.sectionDelimiter} />
            <Text style={styles.sectionTitle}>Dates de formation</Text>
            <FlatList data={course.slots} scrollEnabled={false} initialNumToRender={5} maxToRenderPerBatch={10}
              windowSize={5} renderItem={({ item }) => <Markdown style={markdownStyle(commonStyles.sectionContent)}>
                {`- ${item}`}
              </Markdown>}
            />
          </>}
        {!!get(course, 'trainers', []).length && <>
          <View style={commonStyles.sectionDelimiter} />
          <Text style={styles.sectionTitle}>
            {formatQuantity('Intervenant·e', course.trainers.length, 's', false)}
          </Text>
          {course.trainers
            .map((trainer: TrainerType, index: number) =>
              <InterlocutorCell key={`trainer_${index}`} interlocutor={trainer} />)}
        </>}
        {!!course.tutors?.length && <>
          <View style={commonStyles.sectionDelimiter} />
          <Text style={styles.sectionTitle}>
            {formatQuantity('Tuteur', course.tutors.length, 's', false)}
          </Text>
          {course.tutors
            .map((tutor: TutorType, index: number) => <InterlocutorCell key={`tutor_${index}`} interlocutor={tutor} />)}
        </>}
        {!!course.contact?.identity && <>
          <View style={commonStyles.sectionDelimiter} />
          <ContactInfoContainer contact={course.contact} title={'Votre contact pour la formation'} />
        </>}
      </View>
      <TouchableOpacity style={styles.internalRulesContainer} onPress={() => setIsModalOpened(true)}>
        <Text style={styles.internalRules}>RÈGLEMENT INTÉRIEUR</Text>
      </TouchableOpacity>
      <InternalRulesModal visible={isModalOpened} onRequestClose={() => setIsModalOpened(false)} />
    </About>
  );
};

export default BlendedAbout;
