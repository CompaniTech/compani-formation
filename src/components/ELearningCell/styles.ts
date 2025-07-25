import { StyleSheet } from 'react-native';
import { MARGIN, PADDING, BORDER_WIDTH, BORDER_RADIUS } from '../../styles/metrics';
import { GREY } from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: GREY[100],
    marginHorizontal: MARGIN.MD,
    paddingVertical: PADDING.LG,
    borderWidth: BORDER_WIDTH,
    borderRadius: BORDER_RADIUS.XL,
    borderColor: GREY[200],
  },
  openedContainer: {
    marginRight: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  topContainer: {
    paddingHorizontal: PADDING.MD,
    flexDirection: 'row',
  },
  textContainer: {
    flexGrow: 1,
  },
  iconButtonContainer: {
    alignItems: 'center',
    flexDirection: 'column-reverse',
  },
  openedIconButtonContainer: {
    marginRight: MARGIN.MD,
  },
});

export default styles;
