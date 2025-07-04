import { StyleSheet } from 'react-native';
import { MARGIN } from '../../../styles/metrics';
import { FIRA_SANS_BOLD } from '../../../styles/fonts';
import { GREY } from '../../../styles/colors';

const styles = StyleSheet.create({
  container: {
    margin: MARGIN.SM,
  },
  groupContainer: {
    marginBottom: MARGIN.MD,
  },
  groupLabel: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[900],
    marginBottom: MARGIN.SM,
  },
});

export default styles;
