import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { GREY, YELLOW } from '../../../styles/colors';
import { BORDER_RADIUS, MARGIN, QUESTIONNAIRE_WIDTH } from '../../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    marginVertical: MARGIN.MD,
    alignItems: 'center',
    width: QUESTIONNAIRE_WIDTH,
  },
  AttendanceSheetName: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    textAlign: 'center',
    marginHorizontal: MARGIN.SM,
  },
  iconContainer: {
    marginBottom: MARGIN.SM,
  },
  shadow: {
    backgroundColor: YELLOW[500],
    borderRadius: BORDER_RADIUS.MD,
  },
  icon: {
    height: 64,
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: YELLOW[300],
    borderColor: YELLOW[500],
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.MD,
  },
});

export default styles;
