import { StyleSheet } from 'react-native';
import { COPPER } from '../../styles/colors';
import { FIRA_SANS_MEDIUM } from '../../styles/fonts';
import { MARGIN } from '../../styles/metrics';

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...FIRA_SANS_MEDIUM.MD,
    color: COPPER[500],
    marginBottom: MARGIN.SM,
  },
});

export default styles;
