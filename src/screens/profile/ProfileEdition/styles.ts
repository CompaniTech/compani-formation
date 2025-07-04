import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, BORDER_WIDTH, MARGIN } from '../../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_MEDIUM } from '../../../styles/fonts';
import { GREY, PINK, TRANSPARENT_GREY } from '../../../styles/colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginVertical: MARGIN.LG,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: MARGIN.XL,
  },
  profileImage: {
    height: 88,
    width: 88,
    borderRadius: BORDER_RADIUS.XXL,
    borderWidth: BORDER_WIDTH,
    borderColor: TRANSPARENT_GREY,
  },
  profileEdit: {
    ...FIRA_SANS_MEDIUM.MD,
    color: PINK[500],
    marginTop: MARGIN.MD,
  },
});

export default styles;
