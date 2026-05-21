import { StyleSheet } from 'react-native';
import { GREY, PINK, WHITE } from '../../../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, BUTTON_HEIGHT, MARGIN, PADDING } from '../../../../styles/metrics';
import { FIRA_SANS_MEDIUM } from '../../../../styles/fonts';

const styles = (isSelected: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    marginHorizontal: MARGIN.LG,
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: PADDING.XL,
  },
  footerContainer: {
    backgroundColor: GREY[100],
  },
  answerContainer: {
    marginBottom: MARGIN.LG,
  },
  otherAnswerInput: {
    ...FIRA_SANS_MEDIUM.MD,
    minHeight: BUTTON_HEIGHT,
    borderWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    borderColor: isSelected ? PINK[500] : GREY[200],
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: PADDING.LG,
    color: GREY[900],
    width: '100%',
  },
  shadow: {
    backgroundColor: isSelected ? PINK[500] : GREY[200],
    borderRadius: BORDER_RADIUS.LG,
  },
});

export default styles;
