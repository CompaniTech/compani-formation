import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR } from '../../../../styles/fonts';
import { GREY } from '../../../../styles/colors';
import { MARGIN, PADDING } from '../../../../styles/metrics';

const styles = (isSelected: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  question: {
    ...FIRA_SANS_REGULAR.LG,
    color: GREY[900],
    marginHorizontal: MARGIN.LG,
    marginBottom: MARGIN.XL,
    marginTop: isSelected ? MARGIN.MD : 0,
  },
  inputContainer: {
    flexGrow: 1,
    marginHorizontal: MARGIN.MD,
    paddingBottom: PADDING.XL,
  },
});

export default styles;
