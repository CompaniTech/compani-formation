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
  // The word bank sits above the question so a dragged tile clears the gaps. Dragging the other way only lowers
  // the word bank, never the question: the section holding the live gesture must keep its zIndex, since on
  // Android changing it reorders the parent's children and cancels the touch being tracked.
  questionSection: {
    zIndex: 1,
  },
  answersSection: {
    zIndex: 2,
  },
  loweredAnswersSection: {
    zIndex: 0,
  },
  // A dragged answer is a child of the gap holding it, so it can only clear the other gaps if that gap outranks
  // them. Fill state only changes once a drop has completed, so this never moves mid-gesture.
  filledGap: {
    zIndex: 1,
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
