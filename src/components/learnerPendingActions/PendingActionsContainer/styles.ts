import { StyleSheet } from 'react-native';
import { GREY, YELLOW } from '../../../styles/colors';
import { FIRA_SANS_ITALIC } from '../../../styles/fonts';
import { BORDER_WIDTH, MARGIN, PADDING } from '../../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    backgroundColor: YELLOW[100],
    marginBottom: MARGIN.LG,
    borderColor: GREY[200],
    borderBottomWidth: BORDER_WIDTH,
  },
  header: {
    backgroundColor: YELLOW[300],
    flexDirection: 'row',
    paddingHorizontal: PADDING.LG,
    paddingVertical: PADDING.MD,
    ...FIRA_SANS_ITALIC.SM,
    color: GREY[900],
  },
  cellContainer: {
    flexDirection: 'row',
  },
});

export default styles;
