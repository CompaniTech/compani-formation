import { StyleSheet } from 'react-native';
import { PINK, WHITE } from '../../styles/colors';
import { MARGIN } from '../../styles/metrics';
import { FIRA_SANS_BLACK, NUNITO_SEMI } from '../../styles/fonts';

const styles = StyleSheet.create({
  content: {
    paddingTop: MARGIN.MD,
    paddingHorizontal: MARGIN.MD,
    paddingBottom: MARGIN.XL,
    backgroundColor: PINK[600],
  },
  titleContainer: {
    marginTop: MARGIN.LG,
  },
  screenTitle: {
    ...NUNITO_SEMI.MD,
    color: PINK[200],
  },
  courseTitle: {
    ...FIRA_SANS_BLACK.XL,
    color: WHITE,
  },
});

export default styles;
