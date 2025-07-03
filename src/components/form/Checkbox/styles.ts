import { StyleSheet } from 'react-native';
import { MARGIN, PADDING } from '../../../styles/metrics';
import { FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { GREY } from '../../../styles/colors';

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: PADDING.MD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    margin: MARGIN.SM,
  },
  icon: {
    marginRight: MARGIN.SM,
  },
});

export default styles;
