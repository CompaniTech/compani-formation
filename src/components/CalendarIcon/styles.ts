import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, PADDING, BORDER_WIDTH, ICON } from '../../styles/metrics';
import { WHITE, GREY, GREEN } from '../../styles/colors';
import { NUNITO_SEMI, NUNITO_REGULAR } from '../../styles/fonts';

export const CALENDAR_HEADER_HEIGHT = 16;

const styles = (inputColor: string) => StyleSheet.create({
  container: {
    minWidth: 50,
    position: 'relative',
  },
  dateContainer: {
    height: 72,
    // Do not merge the borderWidths params, avoid an unwanted line in android
    borderTopWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.SM,
    borderColor: inputColor,
    alignItems: 'center',
    paddingBottom: PADDING.SM,
    overflow: 'hidden',
  },
  dayOfWeek: {
    backgroundColor: inputColor,
    width: '100%',
    height: CALENDAR_HEADER_HEIGHT,
    ...NUNITO_SEMI.XS,
    color: WHITE,
    textAlign: 'center',
  },
  dayOfMonth: {
    ...NUNITO_REGULAR.XL,
    height: 32,
    paddingHorizontal: PADDING.SM,
  },
  month: {
    ...NUNITO_SEMI.SM,
    color: inputColor,
    paddingHorizontal: PADDING.SM,
  },
  toPlan: {
    ...NUNITO_REGULAR.XXL,
  },
  datesLengthContainer: {
    position: 'absolute',
    bottom: -6,
    right: -10,
  },
  datesLength: {
    ...NUNITO_REGULAR.SM,
    color: inputColor,
    paddingHorizontal: PADDING.SM,
  },
  finishedContainer: {
    position: 'absolute',
    bottom: -6,
    right: -16,
    width: ICON.XL,
    height: ICON.XL,
    backgroundColor: GREEN[600],
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 4 * BORDER_WIDTH,
    borderColor: GREEN[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: -6,
    right: -12,
    width: ICON.MD,
    height: ICON.MD,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    width: ICON.XS,
    height: ICON.XS,
  },
  shadow: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.SM,
  },
  manyDatesShadow: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: BORDER_WIDTH,
    borderColor: inputColor,
    opacity: 0.6,
    zIndex: -2,
  },
  shadowHeader: {
    backgroundColor: inputColor,
    opacity: 0.6,
    height: CALENDAR_HEADER_HEIGHT,
    borderTopLeftRadius: BORDER_RADIUS.SM,
    borderTopRightRadius: BORDER_RADIUS.SM,
  },
});

export default styles;
