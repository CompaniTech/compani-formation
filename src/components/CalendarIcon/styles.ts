import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, PADDING, BORDER_WIDTH, ICON } from '../../styles/metrics';
import { PINK, WHITE, GREY, GREEN } from '../../styles/colors';
import { NUNITO_SEMI, NUNITO_REGULAR } from '../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    minWidth: 50,
    position: 'relative',
  },
  dateContainer: {
    height: 60,
    // Do not merge the borderWidths params, avoid an unwanted line in android
    borderTopWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.SM,
    borderColor: PINK[500],
    alignItems: 'center',
    paddingBottom: PADDING.SM,
    overflow: 'hidden',
  },
  dayOfWeekContainer: {
    backgroundColor: PINK[500],
    width: '100%',
    paddingHorizontal: PADDING.MD,
    justifyContent: 'center',
    height: 15,
  },
  dayOfWeek: {
    ...NUNITO_SEMI.XS,
    color: WHITE,
    textAlign: 'center',
  },
  dayOfMonth: {
    ...NUNITO_REGULAR.MD,
    height: 22,
    paddingHorizontal: PADDING.SM,
  },
  month: {
    ...NUNITO_SEMI.SM,
    color: PINK[500],
    height: 23,
    paddingHorizontal: PADDING.SM,
  },
  toPlan: {
    ...NUNITO_REGULAR.XL,
    height: 40,
  },
  shadow: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.SM,
  },
  manyDatesShadow: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: PINK[500],
  },
  datesLengthContainer: {
    position: 'absolute',
    bottom: '-10%',
    left: '75%',
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: BORDER_WIDTH,
    borderColor: PINK[500],
    backgroundColor: WHITE,
  },
  datesLength: {
    ...NUNITO_REGULAR.SM,
    color: PINK[500],
    paddingHorizontal: 5,
  },
  finishedContainer: {
    position: 'absolute',
    bottom: '-10%',
    left: '75%',
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
    bottom: '-10%',
    left: '75%',
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
});

export default styles;
