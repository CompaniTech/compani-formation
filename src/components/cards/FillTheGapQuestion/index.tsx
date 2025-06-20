import { JSX } from 'react';
import { Text, View } from 'react-native';
import cardsStyle from '../../../styles/cards';
import styles from './styles';

interface FillTheGapQuestionProps {
  text: string,
  isValidated: boolean,
  renderGap: (index: number) => JSX.Element,
}

const FillTheGapQuestion = ({ text, isValidated, renderGap }: FillTheGapQuestionProps) => {
  // DON'T remove the spaces around '<trou>' in replace. They are needed for the display.
  const splittedText = text.replace(/<trou>/g, ' <trou> ').split(/\s+/);

  const formatText = (words: Array<string>) => {
    let i = 0;
    return words.map((word) => {
      if (word === '<trou>') {
        const gapIndex = `<trou${i}>`;
        i += 1;
        return gapIndex;
      }

      return word;
    });
  };

  return (
    <View style={[cardsStyle.question, styles.questionContainer]} pointerEvents={isValidated ? 'none' : 'auto'}>
      {formatText(splittedText).map((txt, index) => {
        if (txt.match(/^<trou[0,1]>$/)) return renderGap(Number(txt.replace(/^<trou([0,1])>$/, '$1')));
        return <Text style={styles.question} key={`text${index}`}>{`${txt} `}</Text>;
      })
      }
    </View>
  );
};

export default FillTheGapQuestion;
