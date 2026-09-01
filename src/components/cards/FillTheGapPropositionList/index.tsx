import { JSX } from 'react';
import { View } from 'react-native';
import { Droppable } from 'react-native-reanimated-dnd';
import { FillTheGapAnswers } from '../../../screens/courses/cardTemplates/FillTheGapCard';
import { IS_WEB } from '../../../core/data/constants';
import styles from './styles';

interface FillTheGapPropositionListProps {
  isValidated: boolean,
  propositions: FillTheGapAnswers[],
  setProposition: (movedProp: string) => void,
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
      : <Droppable<string> style={styles.gapContainer} key={`proposition${idx}`} onDrop={setProposition}>
        {renderContent(proposition)}
      </Droppable>))}
  </View>
);

export default FillTheGapPropositionList;
