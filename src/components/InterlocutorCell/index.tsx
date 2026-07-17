import { View, Text, Image } from 'react-native';
import { formatIdentity } from '../../core/helpers/utils';
import { TrainerType, TutorType } from '../../types/CourseTypes';
import { LONG_FIRSTNAME_LONG_LASTNAME } from '../../core/data/constants';
import commonStyles from '../../styles/common';
import styles from './style';

interface InterlocutorCellProps {
  interlocutor: TrainerType | TutorType,
}

const InterlocutorCell = ({ interlocutor }: InterlocutorCellProps) => {
  const interlocutorPictureSource = interlocutor?.picture?.link
    ? { uri: interlocutor.picture.link }
    : require('../../../assets/images/default_avatar.webp');

  return (
    <>
      <View style={styles.subSectionContainer}>
        <Image style={styles.interlocutorPicture} source={interlocutorPictureSource} />
        <Text style={styles.subSectionTitle}>
          {formatIdentity(interlocutor.identity, LONG_FIRSTNAME_LONG_LASTNAME)}
        </Text>
      </View>
      {!!((interlocutor as TrainerType).biography) && <Text style={commonStyles.sectionContent}>
        {(interlocutor as TrainerType).biography}
      </Text>}
    </>
  );
};

export default InterlocutorCell;
