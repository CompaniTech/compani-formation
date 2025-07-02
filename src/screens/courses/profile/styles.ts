import { StyleSheet } from 'react-native';
import { WHITE, GREY, PINK } from '../../../styles/colors';
import { BORDER_RADIUS, BUTTON_HEIGHT, MARGIN, PADDING } from '../../../styles/metrics';
import { NUNITO_SEMI, FIRA_SANS_MEDIUM, FIRA_SANS_REGULAR } from '../../../styles/fonts';

const styles = StyleSheet.create({
  separator: {
    marginBottom: MARGIN.MD,
  },
  flatList: {
    marginVertical: MARGIN.MD,
  },
  progressBarContainer: {
    marginBottom: MARGIN.MD,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: MARGIN.XL,
  },
  progressBarText: {
    ...NUNITO_SEMI.XS,
    color: GREY[600],
  },
  buttonsContainer: {
    marginVertical: MARGIN.LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: MARGIN.LG,
    marginHorizontal: MARGIN.XL,
  },
  buttonContent: {
    borderRadius: BORDER_RADIUS.SM,
    paddingVertical: PADDING.MD,
    paddingHorizontal: PADDING.XXL,
    marginHorizontal: MARGIN.MD,
    backgroundColor: PINK[500],
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateContent: {
    flexDirection: 'row',
  },
  certificateText: {
    ...FIRA_SANS_MEDIUM.LG,
    color: WHITE,
    paddingLeft: PADDING.MD,
  },
  adminButton: {
    width: '95%',
    marginBottom: 24,
  },
  traineeProgressContainer: {
    alignItems: 'center',
  },
  traineeProgress: {
    ...FIRA_SANS_REGULAR.SM,
    color: PINK[500],
  },
});

export default styles;
