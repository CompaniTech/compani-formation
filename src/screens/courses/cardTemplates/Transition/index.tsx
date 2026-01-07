import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardFooter from '../../../../components/cards/CardFooter';
import CardHeader from '../../../../components/cards/CardHeader';
import { useGetCard, useGetCardIndex } from '../../../../store/cards/hooks';
import { WHITE } from '../../../../styles/colors';
import { EDGES } from '../../../../styles/metrics';
import { TransitionType } from '../../../../types/CardType';
import styles from './styles';

interface TransitionProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
}

const Transition = ({ isLoading, setIsRightSwipeEnabled }: TransitionProps) => {
  const card: TransitionType = useGetCard();
  const index = useGetCardIndex();
  useEffect(() => setIsRightSwipeEnabled(true));

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <CardHeader color={WHITE} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{card.title}</Text>
      </View>
      <CardFooter index={index} color={WHITE} />
    </SafeAreaView>
  );
};

export default Transition;
