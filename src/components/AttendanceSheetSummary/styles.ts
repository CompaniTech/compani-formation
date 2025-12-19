import { StyleSheet } from 'react-native';
import { BUTTON_HEIGHT, MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_BOLD } from '../../styles/fonts';
import { GREY } from '../../styles/colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  header: {
    paddingTop: PADDING.LG,
    paddingHorizontal: PADDING.LG,
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    flexGrow: 1,
    marginHorizontal: MARGIN.LG,
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginVertical: MARGIN.LG,
  },
  checkboxContainer: {
    marginHorizontal: MARGIN.LG,
    backgroundColor: GREY[100],
  },
  button: {
    marginHorizontal: MARGIN.LG,
    marginBottom: MARGIN.LG,
    height: BUTTON_HEIGHT + 2 * MARGIN.MD,
    justifyContent: 'flex-end',
  },
  image: {
    height: 300,
    resizeMode: 'contain',
  },
});

export default styles;
