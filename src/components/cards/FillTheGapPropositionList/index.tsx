import { JSX } from 'react';
import { View } from 'react-native';
import { DraxView } from 'react-native-drax';
import { FillTheGapAnswers } from '../../../screens/courses/cardTemplates/FillTheGapCard';
import { IS_WEB } from '../../../core/data/constants';
import styles from './styles';

interface FillTheGapPropositionListProps {
  isValidated: boolean,
  propositions: FillTheGapAnswers[],
  setProposition: (event: any) => void,
  renderContent: (item: FillTheGapAnswers) => JSX.Element,
}

const FillTheGapPropositionList = ({
  isValidated, propositions,
  setProposition,
  renderContent,
}: FillTheGapPropositionListProps) => (
  <View style={styles.answersContainer} pointerEvents={isValidated ? 'none' : 'auto'}>
    {propositions.map((proposition, idx) => (IS_WEB
      ? <View style={styles.gapContainer} key={`proposition${idx}`}>{renderContent(proposition)}</View>
      : <DraxView style={styles.gapContainer} key={`proposition${idx}`}
        onReceiveDragDrop={event => setProposition(event)} renderContent={() => renderContent(proposition)} />))}
  </View>
);

export default FillTheGapPropositionList;
