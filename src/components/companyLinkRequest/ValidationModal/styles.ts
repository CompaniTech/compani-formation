import { StyleSheet } from 'react-native';
import { GREY, PINK } from '../../../styles/colors';
import { MARGIN, BUTTON_HEIGHT, BORDER_WIDTH, BORDER_RADIUS, PADDING } from '../../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR } from '../../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    padding: PADDING.MD,
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginBottom: MARGIN.MD,

  },
  contentText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    marginBottom: MARGIN.XL,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {
    ...FIRA_SANS_REGULAR.MD,
    color: PINK[500],
  },
  button: {
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS.MD,
    padding: PADDING.MD,
    borderColor: GREY[300],
    marginBottom: MARGIN.MD,
  },
  companyName: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[600],
    marginHorizontal: MARGIN.MD,
  },
});

export default styles;
