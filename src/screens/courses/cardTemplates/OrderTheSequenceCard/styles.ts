import { StyleSheet } from 'react-native';
import { GREY } from '../../../../styles/colors';
import { FIRA_SANS_REGULAR } from '../../../../styles/fonts';
import { MARGIN } from '../../../../styles/metrics';

const styles = (backgroundColor: string) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  container: {
    flexGrow: 1,
  },
  propositionsContainer: {
    marginHorizontal: MARGIN.LG,
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginBottom: MARGIN.SM,
  },
  questionContainer: {
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  question: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
  },
  footerContainer: {
    backgroundColor,
  },
});

export default styles;
