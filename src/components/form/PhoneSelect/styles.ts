import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, INPUT_HEIGHT, MARGIN, PADDING } from '../../../styles/metrics';
import { GREY, ORANGE, WHITE } from '../../../styles/colors';
import { FIRA_SANS_ITALIC, FIRA_SANS_REGULAR } from '../../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorContainer: {
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
    height: INPUT_HEIGHT,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.MD,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingHorizontal: PADDING.MD,
  },
  input: {
    width: '100%',
    flexShrink: 1,
  },
  unvalid: {
    ...FIRA_SANS_ITALIC.SM,
    color: ORANGE[600],
    marginTop: -MARGIN.MD,
    marginBottom: MARGIN.MD,
  },
  caption: {
    ...FIRA_SANS_REGULAR.SM,
    marginBottom: -MARGIN.MD,
    color: GREY[600],
  },
});

export default styles;
