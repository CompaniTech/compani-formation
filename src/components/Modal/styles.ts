import { StyleSheet } from 'react-native';
import { WHITE, MODAL_BACKDROP_GREY } from '../../styles/colors';
import { BORDER_RADIUS, PADDING } from '../../styles/metrics';

export default StyleSheet.create({
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
    borderRadius: BORDER_RADIUS.MD,
    width: '90%',
    maxHeight: 400,
    padding: PADDING.LG,
  },
});
