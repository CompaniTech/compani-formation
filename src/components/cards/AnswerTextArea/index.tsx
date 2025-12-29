import { useState, useEffect } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import Shadow from '../../design/Shadow';
import { GREY } from '../../../styles/colors';
import styles from './styles';
import commonStyle from '../../../styles/common';

interface AnswerQuestionProps {
  answer: string,
  onChangeText: (string: string) => void,
  onSelect: (boolean: boolean) => void,
  scrollTo: (number: number) => void,
}

const AnswerTextArea = ({ onChangeText, onSelect, scrollTo, answer }: AnswerQuestionProps) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const keyboardDidHide = () => Keyboard.dismiss();

  const style = styles(isSelected);

  useEffect(() => {
    const hideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => {
      hideListener.remove();
    };
  });

  const onTouchStart = () => {
    setIsSelected(true);
    onSelect(true);
  };

  const onBlur = () => {
    setIsSelected(false);
    onSelect(false);
  };

  return (
    <View style={style.container}>
      <TextInput style={!answer.length ? [style.input, commonStyle.placeholder] : style.input}
        placeholder={'Votre réponse...'} placeholderTextColor={GREY[300]} value={answer} multiline={true}
        onChangeText={onChangeText} onTouchStart={onTouchStart} onBlur={onBlur}
        onContentSizeChange={(event) => { scrollTo(event.nativeEvent.contentSize.height); }}/>
      <Shadow customStyle={style.shadow} />
    </View>
  );
};

export default AnswerTextArea;
