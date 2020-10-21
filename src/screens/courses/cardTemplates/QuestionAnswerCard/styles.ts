import { StyleSheet } from 'react-native';
import { GREY } from '../../../../styles/colors';
import { MARGIN, PADDING } from '../../../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: MARGIN.LG,
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: PADDING.XL,
  },
  footerContainer: {
    backgroundColor: GREY[100],
  },
});

export default styles;
