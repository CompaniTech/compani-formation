import { StyleSheet } from 'react-native';
import { WHITE, TRANSPARENT_GREY, GREY, GREEN, PINK } from '../../styles/colors';
import { BORDER_RADIUS, PADDING, PROGRAM_CELL_WIDTH, BORDER_WIDTH, ICON, MARGIN } from '../../styles/metrics';
import { FIRA_SANS_REGULAR, FIRA_SANS_BOLD } from '../../styles/fonts';

const imageHeight = 128;
const containerHeight = 322;
const styles = StyleSheet.create({
  courseContainer: {
    borderRadius: BORDER_RADIUS.SM,
    width: PROGRAM_CELL_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderColor: TRANSPARENT_GREY,
    overflow: 'hidden',
    backgroundColor: WHITE,
    height: containerHeight,
  },
  image: {
    height: imageHeight,
  },
  imageContainer: {
    height: imageHeight,
  },
  title: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[900],
    padding: PADDING.MD,
    backgroundColor: WHITE,
    borderBottomLeftRadius: BORDER_RADIUS.SM,
    borderBottomRightRadius: BORDER_RADIUS.SM,
  },
  description: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    padding: PADDING.MD,
  },
  eLearning: {
    paddingLeft: PADDING.MD,
    color: GREY[500],
  },
  theoreticalDuration: {
    paddingLeft: PADDING.MD,
    paddingBottom: PADDING.MD,
    color: PINK[500],
  },
  progressContainer: {
    margin: MARGIN.SM,
    width: ICON.MD,
    height: ICON.MD,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: ICON.XS,
    height: ICON.XS,
  },
  finishedContainer: {
    margin: MARGIN.SM,
    width: ICON.XL,
    height: ICON.XL,
    backgroundColor: GREEN[600],
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 4 * BORDER_WIDTH,
    borderColor: GREEN[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  unstartedContainer: {
    margin: MARGIN.SM,
    width: ICON.MD,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.LG,
  },
});

export default styles;
