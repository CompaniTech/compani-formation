import { StyleSheet } from 'react-native';
import { GREY, PINK, BLACK } from '../../../styles/colors';
import { FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { BORDER_WIDTH, ICON, PADDING } from '../../../styles/metrics';

const styles = StyleSheet.create({
  line: {
    position: 'relative',
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    top: ICON.XL / 2 + BORDER_WIDTH,
    marginRight: ICON.XL / 2,
    marginLeft: ICON.XL / 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: ICON.XL,
    height: ICON.XL,
    alignItems: 'center',
    marginBottom: PADDING.XL,
  },
  button: {
    justifyContent: 'center',
    height: ICON.XL,
  },
  circle: {
    height: ICON.XS,
    width: ICON.XS,
    borderRadius: ICON.XS / 2,
    backgroundColor: GREY[200],
  },
  selectedCircle: {
    height: ICON.XL,
    width: ICON.XL,
    borderRadius: ICON.XL / 2,
    backgroundColor: PINK[300],
    borderWidth: 2,
    borderColor: PINK[500],
  },
  text: {
    ...FIRA_SANS_REGULAR.MD,
    textAlign: 'center',
    color: BLACK,
  },
  selectedText: {
    ...FIRA_SANS_REGULAR.XL,
    textAlign: 'center',
    color: PINK[600],
  },
});

export default styles;
