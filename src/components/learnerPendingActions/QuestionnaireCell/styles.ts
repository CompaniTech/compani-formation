import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { GREY, YELLOW } from '../../../styles/colors';
import { BORDER_RADIUS, MARGIN, QUESTIONNAIRE_WIDTH } from '../../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    margin: MARGIN.MD,
    alignItems: 'center',
    width: QUESTIONNAIRE_WIDTH,
  },
  questionaireName: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
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
