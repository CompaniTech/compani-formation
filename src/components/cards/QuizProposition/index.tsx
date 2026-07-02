import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GREY, GREEN, ORANGE, PINK } from '../../../styles/colors';
import Shadow from '../../design/Shadow';
import styles from './styles';

interface QuizPropositionProps {
  item: string,
  isGoodAnswer: boolean,
  index: number,
  isValidated: boolean,
  isSelected: boolean,
  onPress: (index: number) => void,
}

const QuizProposition = ({
  item,
  isGoodAnswer,
  index,
  isValidated = false,
  isSelected,
  onPress,
}: QuizPropositionProps) => {
  const color = (() => {
    if (isSelected && isGoodAnswer && isValidated) return GREEN[600];
    if (isSelected && isValidated) return ORANGE[600];
    if (isSelected) return PINK[500];
    return GREY[500];
  })();

  const setColorOnPress = () => {
    if (!isValidated) onPress(index);
  };

  const isMarkerVisible = (isValidated && isGoodAnswer) || (isSelected && isValidated);
  const style = styles(color, isSelected, isGoodAnswer, isValidated);

  return (
    <View style={style.answerContainer}>
      <TouchableOpacity style={style.answer} onPress={() => { setColorOnPress(); }} disabled={isValidated}>
        <View style={style.textContainer}>
          <Text style={style.text}>{item}</Text>
        </View>
        {isMarkerVisible &&
        <View style={style.markerContainer}>
          <Feather style={style.marker} name={isGoodAnswer && isValidated ? 'check-circle' : 'x-circle'} />
        </View>
        }
      </TouchableOpacity>
      <Shadow customStyle={style.shadow} />
    </View>
  );
};

export default QuizProposition;
