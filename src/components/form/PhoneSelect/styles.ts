import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, INPUT_HEIGHT, MARGIN, PADDING } from '../../../styles/metrics';
import { BLACK, GREY, ORANGE, WHITE } from '../../../styles/colors';
import { FIRA_SANS_ITALIC, FIRA_SANS_MEDIUM, FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { IS_WEB } from '../../../core/data/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    flexShrink: 1,
  },
  inputWeb: {
    maxWidth: 75,
    ...FIRA_SANS_MEDIUM.MD,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: WHITE,
    paddingHorizontal: PADDING.MD,
  },
  inputIOS: {
    ...FIRA_SANS_MEDIUM.MD,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: WHITE,
    paddingHorizontal: PADDING.MD,
  },
  inputAndroid: {
    color: BLACK,
    ...FIRA_SANS_MEDIUM.MD,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: WHITE,
    paddingHorizontal: PADDING.MD,
  },
  unvalid: {
    ...FIRA_SANS_ITALIC.SM,
    color: ORANGE[600],
    ...(!IS_WEB && { marginTop: -MARGIN.MD }),
    marginBottom: MARGIN.MD,
  },
  caption: {
    ...FIRA_SANS_REGULAR.SM,
    ...(!IS_WEB && { marginBottom: -MARGIN.MD }),
    color: GREY[600],
  },
});

export default styles;
