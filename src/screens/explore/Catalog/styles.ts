import { StyleSheet } from 'react-native';
import { FIRA_SANS_MEDIUM, FIRA_SANS_REGULAR } from '../../../styles/fonts';
import {
  MAIN_MARGIN_LEFT,
  MARGIN, SCREEN_WIDTH,
  BACKGROUND_SPOT_WIDTH,
  INPUT_HEIGHT,
  BORDER_RADIUS,
  PADDING,
} from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';

const styles = (count = { color: '', background: '' }) => StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  programsCount: {
    ...FIRA_SANS_REGULAR.SM,
    color: count.color || undefined,
    backgroundColor: count.background || undefined,
  },
  programContainer: {
    paddingHorizontal: MAIN_MARGIN_LEFT,
  },
  separator: {
    marginRight: MARGIN.SM,
  },
  sectionContainer: {
    marginVertical: MARGIN.LG,
  },
  rightBackground: {
    resizeMode: 'contain',
    position: 'absolute',
    transform: [{ translateX: SCREEN_WIDTH - BACKGROUND_SPOT_WIDTH * 0.5 }],
    top: -32,
  },
  leftBackground: {
    resizeMode: 'contain',
    position: 'absolute',
    transform: [{ translateX: -BACKGROUND_SPOT_WIDTH * 0.5 }],
    top: -32,
  },
  input: {
    ...FIRA_SANS_MEDIUM.MD,
    backgroundColor: GREY[100],
    height: INPUT_HEIGHT,
    marginHorizontal: MARGIN.MD,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: PADDING.LG,
    marginTop: -MARGIN.MD,
    color: GREY[900],
    textAlignVertical: 'top',
  },
  placeholder: {
    ...FIRA_SANS_REGULAR.MD,
  },
});

export default styles;
