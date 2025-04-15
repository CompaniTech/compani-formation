// @ts-nocheck

import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import ExitModal from '../../../components/ExitModal';
import { IS_IOS, IS_WEB, SWIPE_SENSIBILITY } from '../../../core/data/constants';
import { useGetExitConfirmationModal, useSetExitConfirmationModal } from '../../../store/cards/hooks';
import CardTemplate from '../cardTemplates/CardTemplate';
import styles from './styles';

interface CardScreenProps {
  index: number,
  goBack: () => void,
}

const CardScreen = ({ index, goBack }: CardScreenProps) => {
  const exitConfirmationModal = useGetExitConfirmationModal();
  const setExitConfirmationModal = useSetExitConfirmationModal();
  const navigation = useNavigation();
  const [isLeftSwipeEnabled, setIsLeftSwipeEnabled] = useState<boolean>(true);
  const [isRightSwipeEnabled, setIsRightSwipeEnabled] = useState<boolean>(false);

  const onSwipe = Gesture
    .Pan()
    .onTouchesMove((_, state) => { if (IS_WEB) state.activate(); })
    .onEnd((event) => {
      if (event.translationX > SWIPE_SENSIBILITY && index > 0 && isLeftSwipeEnabled) {
        runOnJS(navigation.navigate)(`card-${index - 1}`);
      }

      if (event.translationX < -SWIPE_SENSIBILITY && isRightSwipeEnabled) {
        runOnJS(navigation.navigate)(`card-${index + 1}`);
      }
    });

  if (!IS_IOS) onSwipe.activeOffsetX([-SWIPE_SENSIBILITY, SWIPE_SENSIBILITY]);

  return (
    <GestureDetector gesture={onSwipe}>
      <View style={styles.cardScreen}>
        <ExitModal onPressConfirmButton={goBack} visible={exitConfirmationModal} title={'Êtes-vous sûr(e) de cela ?'}
          onPressCancelButton={() => setExitConfirmationModal(false)} contentText={'Tous vos progrès seront perdus'} />
        <CardTemplate index={index} setIsLeftSwipeEnabled={setIsLeftSwipeEnabled}
          setIsRightSwipeEnabled={setIsRightSwipeEnabled} />
      </View>
    </GestureDetector>
  );
};

export default CardScreen;
