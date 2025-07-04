import { StyleSheet } from 'react-native';
import { MARGIN } from '../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR } from '../../styles/fonts';
import { GREY } from '../../styles/colors';

export default StyleSheet.create({
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    textAlign: 'center',
    margin: MARGIN.MD,
  },
  body: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    marginBottom: MARGIN.LG,
    textAlign: 'center',
  },
});
