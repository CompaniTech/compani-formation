import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR } from '../../../../styles/fonts';
import { GREY, PINK } from '../../../../styles/colors';
import { MARGIN, PADDING } from '../../../../styles/metrics';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  container: {
    flexGrow: 1,
    marginHorizontal: MARGIN.LG,
  },
  surveyScoreContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    ...FIRA_SANS_REGULAR.LG,
    color: GREY[900],
    justifyContent: 'flex-start',
  },
  labelContainer: {
    paddingTop: PADDING.XL,
    paddingHorizontal: PADDING.LG,
  },
  text: {
    color: PINK[500],
    margin: MARGIN.XS,
  },
});

export default styles;
