import { JSX } from 'react';
import { View } from 'react-native';
import { Droppable } from 'react-native-reanimated-dnd';
import { FillTheGapAnswers } from '../../../screens/courses/cardTemplates/FillTheGapCard';
import { IS_WEB } from '../../../core/data/constants';
import styles from './styles';

interface FillTheGapPropositionListProps {
  isValidated: boolean,
  propositions: FillTheGapAnswers[],
  renderContent: (item: FillTheGapAnswers) => JSX.Element,
  dropDisabled?: boolean,
  onDrop?: (movedProp: string) => void,
}

const FillTheGapPropositionList = ({
  isValidated, propositions,
  renderContent,
  dropDisabled,
  onDrop,
}: FillTheGapPropositionListProps) => {
  const content = (
    <View style={styles.answersContainer} pointerEvents={isValidated ? 'none' : 'auto'}>
      {propositions.map((proposition, idx) => (
        <View style={[styles.gapContainer, !proposition.isSelected && styles.occupiedSlot]}
          key={`proposition${idx}`}>
          {renderContent(proposition)}
        </View>
      ))}
    </View>
  );

  if (IS_WEB) return content;

  return <Droppable<string> capacity={propositions.length} dropDisabled={dropDisabled} onDrop={onDrop!}>
    {content}
  </Droppable>;
};

export default FillTheGapPropositionList;
