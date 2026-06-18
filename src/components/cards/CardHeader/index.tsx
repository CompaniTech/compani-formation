import { useMemo } from 'react';
import { View } from 'react-native';
import {
  useDisplayProgressBar,
  useGetMaxProgress,
  useGetProgress,
  useSetExitConfirmationModal,
} from '../../../store/cards/hooks';
import { ICON } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import commonStyle from '../../../styles/common';
import { FeatherType } from '../../../types/FeatherType';
import FeatherButton from '../../icons/FeatherButton';
import ProgressBar from '../ProgressBar';
import styles from './styles';

interface CardHeaderProps {
  color?: string,
  icon?: FeatherType,
  onPress?: () => void,
}

const CardHeader = ({ color = GREY[600], icon = 'x-circle', onPress }: CardHeaderProps) => {
  const displayProgressBar = useDisplayProgressBar();
  const maxProgress = useGetMaxProgress();
  const progress = useGetProgress();
  const setExitConfirmationModal = useSetExitConfirmationModal();
  const iconButtonOnPress = onPress || (() => setExitConfirmationModal(true));
  const progressPercentage = useMemo(
    () => (maxProgress ? (progress / maxProgress) * 100 : 0),
    [progress, maxProgress]
  );

  return (
    <View style={styles.container}>
      <FeatherButton name={icon} onPress={iconButtonOnPress} size={ICON.LG} color={color} style={styles.closeButton} />
      {displayProgressBar && <View style={commonStyle.progressBarContainer}>
        <ProgressBar progress={progressPercentage} />
      </View>}
    </View>
  );
};

export default CardHeader;
