import { StackScreenProps } from '@react-navigation/stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Courses from '../../../api/courses';
import { RootStackParamList } from '../../../types/NavigationType';
import ProgressBar from '../../../components/cards/ProgressBar';
import { StepType } from '../../../types/StepTypes';
import commonStyles from '../../../styles/common';
import styles from './styles';
import FeatherButton from '../../../components/icons/FeatherButton';
import { EDGES, ICON } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import { formatIdentity } from '../../../core/helpers/utils';

interface TraineeFollowUpProps extends StackScreenProps<RootStackParamList, 'TraineeFollowUp'> {}
const TraineeFollowUp = ({ route, navigation }: TraineeFollowUpProps) => {
  const { courseId, trainee } = route.params;
  const [steps, setSteps] = useState<StepType[]>([]);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [traineeIdentity, setTraineeIdentity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCourseFollowUp = async () => {
      try {
        setIsLoading(true);
        const fetchedFollowUp = await Courses.getFollowUp(courseId, { trainee });
        setTotalProgress(fetchedFollowUp.trainee.progress.eLearning);
        setSteps(fetchedFollowUp.trainee.steps);
        setTraineeIdentity(formatIdentity(fetchedFollowUp.trainee.identity, 'FL'));
        setIsLoading(false);
      } catch (e: any) {
        console.error(e);
        setIsLoading(false);
      }
    };
    getCourseFollowUp();
  }, [courseId, trainee]);

  const hardwareBackPress = useCallback(() => {
    navigation.goBack();
    return true;
  }, [navigation]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, [hardwareBackPress]);

  const renderStep = (step: StepType) => <>
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{step.name}</Text>
      <View style={commonStyles.progressBarContainer}>
        <ProgressBar progress={step.progress.eLearning * 100} />
      </View>
      <Text style={styles.progressBarText}>{Math.round(step.progress.eLearning * 100)}%</Text>
    </View>
    <View style={commonStyles.sectionDelimiter} />
  </>;

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <View style={styles.header}>
        <FeatherButton name='arrow-left' onPress={() => navigation.goBack()} size={ICON.MD} color={GREY[600]} />
      </View>
      {isLoading
        ? <View style={styles.loading}>
          <ActivityIndicator style={commonStyles.disabled} color={GREY[800]} size="small" />
        </View>
        : <View style={styles.container}>
          <Text style={styles.title}>Suivi e-learning de {traineeIdentity}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.totalProgress}>Progression totale</Text>
            <View style={commonStyles.progressBarContainer}>
              <ProgressBar progress={totalProgress * 100} />
            </View>
            <Text style={styles.progressBarText}>{Math.round(totalProgress * 100)}%</Text>
          </View>
          <FlatList data={steps} keyExtractor={item => item._id} renderItem={({ item }) => renderStep(item)} />
        </View>}
    </SafeAreaView>
  );
};

export default TraineeFollowUp;
