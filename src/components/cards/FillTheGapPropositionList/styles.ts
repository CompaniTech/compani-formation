import { StyleSheet } from 'react-native';
import { GREY } from '../../../styles/colors';
import { BORDER_RADIUS, GAP_WIDTH, INPUT_HEIGHT, MARGIN } from '../../../styles/metrics';

const styles = StyleSheet.create({
  answersContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gapContainer: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.MD,
    marginHorizontal: MARGIN.SM,
    marginBottom: MARGIN.SM,
    height: INPUT_HEIGHT,
    width: GAP_WIDTH,
  },
  loweredContainer: {
    zIndex: -1,
  },
});

export default styles;
