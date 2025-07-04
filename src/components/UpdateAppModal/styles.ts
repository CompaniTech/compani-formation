import { StyleSheet } from 'react-native';
import { MARGIN } from '../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR } from '../../styles/fonts';
import { GREY } from '../../styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginBottom: MARGIN.LG,
    textAlign: 'center',
  },
  contentText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    textAlign: 'center',
    marginBottom: MARGIN.LG,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
