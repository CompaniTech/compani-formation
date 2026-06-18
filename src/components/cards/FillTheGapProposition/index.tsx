import { View, Text } from 'react-native';
import { GREY, GREEN, ORANGE } from '../../../styles/colors';
import Shadow from '../../design/Shadow';
import styles from './styles';
import { FillTheGapAnswers } from '../../../screens/courses/cardTemplates/FillTheGapCard';

interface FillTheGapPropositionProps {
  item: FillTheGapAnswers,
  isGoodAnswer: boolean,
  isValidated: boolean,
  isSelected: boolean,
}

const FillTheGapProposition = ({ item, isGoodAnswer, isValidated, isSelected }: FillTheGapPropositionProps) => {
  const color = (() => {
    if (isGoodAnswer && isValidated) return GREEN[600];
    if (isSelected && isValidated) return ORANGE[600];
    return GREY[200];
  })();

  const style = styles({ color, isGoodAnswer, isSelected, isValidated });

  return (
    <>
      <View style={item.isSelected ? { opacity: 0 } : style.textContainer }>
        <Text style={style.text}>{item.text}</Text>
      </View>
      <Shadow customStyle={style.shadow} />
    </>
  );
};

export default FillTheGapProposition;
