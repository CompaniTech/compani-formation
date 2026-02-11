import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, INPUT_HEIGHT, PADDING } from '../../../styles/metrics';
import { BLACK, GREY, TRANSPARENT_DARK_GREY, WHITE } from '../../../styles/colors';
import { FIRA_SANS_MEDIUM } from '../../../styles/fonts';

const styles = StyleSheet.create({
  selectedContainer: {
    paddingHorizontal: PADDING.LG,
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: WHITE,
  },
  selectedText: {
    ...FIRA_SANS_MEDIUM.MD,
    color: BLACK,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: TRANSPARENT_DARK_GREY,
    justifyContent: 'center',
    paddingHorizontal: PADDING.XL,
  },
  modalContent: {
    backgroundColor: WHITE,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
    borderRadius: BORDER_RADIUS.MD,
  },
  itemContainer: {
    padding: PADDING.LG,
  },
  itemText: {
    ...FIRA_SANS_MEDIUM.MD,
  },
});

export default styles;
