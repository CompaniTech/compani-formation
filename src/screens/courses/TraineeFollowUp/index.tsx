import { StackScreenProps } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Courses from '../../../api/courses';
import { RootStackParamList } from '../../../types/NavigationType';
import ProgressBar from '../../../components/cards/ProgressBar';
import { StepType } from '../../../types/StepTypes';
import commonStyles from '../../../styles/common';
import styles from './styles';
import FeatherButton from '../../../components/icons/FeatherButton';
import { ICON } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import { formatIdentity } from '../../../core/helpers/utils';

interface TraineeFollowUpProps extends StackScreenProps<RootStackParamList, 'TraineeFollowUp'> {
}
const TraineeFollowUp = ({ route, navigation }: TraineeFollowUpProps) => {
  const { courseId, trainee } = route.params;
  const [steps, setSteps] = useState<StepType[]>([]);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [traineeIdentity, setTraineeIdentity] = useState<string>('');

  useEffect(() => {
    const getCourseFollowUp = async () => {
      try {
        const fetchedFollowUp = await Courses.getFollowUp(courseId, { trainee });
        setTotalProgress(fetchedFollowUp.trainee.progress.eLearning);
        setSteps(fetchedFollowUp.trainee.steps);
        setTraineeIdentity(formatIdentity(fetchedFollowUp.trainee.identity, 'FL'));
      } catch (e: any) {
        console.error(e);
      }
    };
    getCourseFollowUp();
  }, [courseId, trainee]);

  const renderStep = (step: StepType) => <>
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{step.name}</Text>
      <View style={commonStyles.progressBarContainer}>
        <ProgressBar progress={step.progress.eLearning * 100} />
      </View>
      <Text style={styles.progressBarText}>{(step.progress.eLearning * 100).toFixed(0)}%</Text>
    </View>
    <View style={commonStyles.sectionDelimiter} />
  </>;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <FeatherButton name='arrow-left' onPress={() => navigation.goBack()} size={ICON.MD} color={GREY[600]} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Suivi e-learning de {traineeIdentity}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.totalProgress}>Progression Totale</Text>
          <View style={commonStyles.progressBarContainer}>
            <ProgressBar progress={totalProgress * 100} />
          </View>
          <Text style={styles.progressBarText}>{(totalProgress * 100).toFixed(0)}%</Text>
        </View>
        <FlatList data={steps} keyExtractor={item => `${item._id}`} renderItem={({ item }) => renderStep(item)} />
      </View>
    </SafeAreaView>
  );
};

export default TraineeFollowUp;
