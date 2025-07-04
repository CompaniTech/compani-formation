import { StyleSheet } from 'react-native';
import { WHITE, MODAL_BACKDROP_GREY, PINK, GREY } from '../../styles/colors';
import { BORDER_RADIUS, PADDING, MARGIN, BUTTON_HEIGHT } from '../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR } from '../../styles/fonts';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: MODAL_BACKDROP_GREY,
  },
  modalContent: {
    display: 'flex',
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.XL,
    width: '90%',
    padding: PADDING.LG,
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginBottom: MARGIN.XL,
  },
  contentText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    marginBottom: MARGIN.XL,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: PINK[500],
  },
  button: {
    width: 80,
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
