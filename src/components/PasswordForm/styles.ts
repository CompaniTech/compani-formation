import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR } from '../../styles/fonts';
import { GREY, PINK } from '../../styles/colors';

const styles = StyleSheet.create({
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginVertical: MARGIN.LG,
  },
  email: {
    ...FIRA_SANS_REGULAR.MD,
    color: PINK[600],
    marginVertical: MARGIN.MD,
    padding: PADDING.MD,
    textAlign: 'center',
    backgroundColor: PINK[100],
    borderRadius: BORDER_RADIUS.LG,
  },
  bold: {
    ...FIRA_SANS_BOLD.MD,
    color: PINK[600],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    marginHorizontal: MARGIN.LG,
  },
  goBack: {
    margin: MARGIN.MD,
  },
  input: {
    marginBottom: MARGIN.SM,
  },
  footer: {
    marginBottom: MARGIN.XL,
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default styles;
