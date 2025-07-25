import { StyleSheet } from 'react-native';
import { GREY } from '../../../../styles/colors';
import { BORDER_RADIUS, INPUT_HEIGHT, MARGIN, GAP_WIDTH } from '../../../../styles/metrics';

const styles = (backgroundColor: string) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  container: {
    flexGrow: 1,
  },
  gapContainer: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.MD,
    marginHorizontal: MARGIN.SM,
    marginBottom: MARGIN.SM,
    height: INPUT_HEIGHT,
    width: GAP_WIDTH,
  },
  answerContainer: {
    height: INPUT_HEIGHT,
    width: GAP_WIDTH,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  footerContainer: {
    backgroundColor,
  },
});

export default styles;
