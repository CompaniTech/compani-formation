import { StyleSheet } from 'react-native';
import { GREY, ORANGE } from '../../styles/colors';
import { MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR, FIRA_SANS_ITALIC } from '../../styles/fonts';

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: PADDING.LG,
  },
  button: {
    marginHorizontal: MARGIN.SM,
    marginBottom: MARGIN.SM,
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[800],
    textAlign: 'center',
    marginVertical: MARGIN.LG,
  },
  beforeCodeSentText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[800],
    textAlign: 'center',
    marginHorizontal: MARGIN.SM,
    marginBottom: MARGIN.XXL,
  },
  afterCodeSentText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[800],
    textAlign: 'center',
    marginHorizontal: MARGIN.SM,
    marginBottom: MARGIN.LG,
  },
  recipient: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[800],
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: MARGIN.SM,
    marginBottom: MARGIN.XL,
  },
  input: {
    ...FIRA_SANS_REGULAR.XXXL,
    color: GREY[900],
    marginHorizontal: MARGIN.XXS,
    maxWidth: '25%',
    textAlign: 'center',
  },
  goBack: {
    alignSelf: 'flex-end',
  },
  unvalid: {
    ...FIRA_SANS_ITALIC.SM,
    color: ORANGE[600],
    marginHorizontal: MARGIN.SM,
  },
});

export default styles;
