import { Text, View, ImageBackground, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import get from 'lodash/get';
import { ProgramType } from '../../types/CourseTypes';
import styles from './styles';
import ProgressPieChart from '../ProgressPieChart';
import CompaniDuration from '../../core/helpers/dates/companiDurations';
import { LONG_DURATION_H_MM, PT0S } from '../../core/data/constants';

interface ProgramCellProps {
  program: ProgramType,
  theoreticalDuration: string,
  progress?: number | null,
  misc?: string | null,
  onPress: () => void,
}

const ProgramCell = ({
  program,
  theoreticalDuration = PT0S,
  progress = null,
  misc = '',
  onPress,
}: ProgramCellProps) => {
  const programName = program.name || '';
  const programImage = get(program, 'image.link') || '';
  const programDescription = program.description || '';
  const source = programImage
    ? { uri: programImage }
    : require('../../../assets/images/authentication_background_image.webp');

  const progressStyle = () => {
    switch (progress) {
      case 0: return styles.unstartedContainer;
      case 1: return styles.finishedContainer;
      default: return styles.progressContainer;
    }
  };

  return (
    <TouchableOpacity style={styles.courseContainer} onPress={onPress}>
      <View style={styles.imageContainer}>
        <ImageBackground source={source} imageStyle={styles.image}
          style={{ resizeMode: 'contain' } as StyleProp<ViewStyle>}>
          {progress !== null &&
            <View style={progressStyle()}>
              <ProgressPieChart progress={progress} />
            </View>}
        </ImageBackground>
      </View>
      <View style={styles.courseContent}>
        <>
          <Text style={styles.title} lineBreakMode={'tail'} numberOfLines={2}>
            {programName}{misc ? ` - ${misc}` : ''}
          </Text>
          <Text style={styles.description} lineBreakMode={'tail'} numberOfLines={3}>{programDescription}</Text>
        </>
        {!CompaniDuration(theoreticalDuration).isEquivalentTo(PT0S) &&
        <View>
          <Text style={styles.eLearning}>E-LEARNING</Text>
          <Text style={styles.theoreticalDuration}>
            {CompaniDuration(theoreticalDuration).format(LONG_DURATION_H_MM)}
          </Text>
        </View>}
      </View>
    </TouchableOpacity>
  );
};

export default ProgramCell;
