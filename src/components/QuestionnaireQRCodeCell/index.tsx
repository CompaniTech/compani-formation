import { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Text, View, Linking } from 'react-native';
import { capitalizeFirstLetter } from '../../core/helpers/utils';
import { getQuestionnaireTitle } from '../../core/helpers/courses';
import Environment from '../../../environment';
import styles from './styles';

interface QuestionnaireQRCodeCellProps {
  img: string,
  types: string[],
  courseId: string,
  courseTimeline: string,
}

const QuestionnaireQRCodeCell = ({ img, types, courseId, courseTimeline }: QuestionnaireQRCodeCellProps) => {
  const questionnaireTypeTitle = getQuestionnaireTitle(types);
  const qrCodePlaceHolder = `QR Code pour répondre au ${questionnaireTypeTitle}`;
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const defineURL = async () => {
      const webappURL = await Environment.getWebappUrl();
      setUrl(`${webappURL}/ni/questionnaires?courseId=${courseId}&courseTimeline=${courseTimeline}`);
    };
    defineURL();
  }, [courseId, courseTimeline]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalizeFirstLetter(questionnaireTypeTitle)}</Text>
      <Image source={{ uri: img }} style={styles.image} alt={qrCodePlaceHolder}></Image>
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text style={styles.link}>Lien pour répondre au {questionnaireTypeTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuestionnaireQRCodeCell;
