import { useEffect } from 'react';
import { Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import CardHeader from '../../../../components/cards/CardHeader';
import CardFooter from '../../../../components/cards/CardFooter';
import cardsStyle from '../../../../styles/cards';
import { markdownStyle } from '../../../../styles/common';
import styles from './styles';
import { useGetCard, useGetCardIndex } from '../../../../store/cards/hooks';
import { TitleTextMediaType } from '../../../../types/CardType';

interface TitleTextCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

const TitleTextCard = ({ isLoading, setIsRightSwipeEnabled }: TitleTextCardProps) => {
  const card: TitleTextMediaType = useGetCard();
  const index = useGetCardIndex();
  useEffect(() => setIsRightSwipeEnabled(true));

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <CardHeader />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={cardsStyle.title}>{card.title}</Text>
        <Markdown style={markdownStyle(cardsStyle.text)}>{card.text}</Markdown>
      </ScrollView>
      <CardFooter index={index} />
    </SafeAreaView>
  );
};

export default TitleTextCard;
