import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { YELLOW } from '../../../styles/colors';
import { BORDER_RADIUS, MARGIN } from '../../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    margin: MARGIN.MD,
    alignItems: 'center',
    width: 96,
  },
  questionaireName: {
    ...FIRA_SANS_REGULAR.MD,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: MARGIN.SM,
  },
  shadow: {
    backgroundColor: YELLOW[500],
    borderRadius: BORDER_RADIUS.MD,
  },
});

export default styles;
