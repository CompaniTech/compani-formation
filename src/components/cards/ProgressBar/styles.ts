import { StyleSheet } from 'react-native';
import { GREEN, GREY, YELLOW } from '../../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, PROGRESS_BAR_HEIGHT } from '../../../styles/metrics';

const styles = (progressPercentage: number) => StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.SM,
    height: PROGRESS_BAR_HEIGHT,
    flex: 1,
    justifyContent: 'flex-start',
  },
  content: {
    display: 'flex',
    backgroundColor: progressPercentage === 100 ? GREEN[500] : YELLOW[500],
    borderRadius: BORDER_RADIUS.XL,
    width: `${progressPercentage}%`,
    borderRightWidth: BORDER_WIDTH,
    borderColor: GREY[100],
  },
});

export default styles;
