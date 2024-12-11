import { StyleSheet } from 'react-native';
import { MARGIN } from '../../styles/metrics';
import { FIRA_SANS_BLACK, FIRA_SANS_BOLD } from '../../styles/fonts';
import { GREY, PINK } from '../../styles/colors';

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: GREY[100],
    marginHorizontal: MARGIN.LG,
    justifyContent: 'space-between',
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    marginVertical: MARGIN.LG,
    textAlign: 'center',
  },
  text: {
    ...FIRA_SANS_BLACK.MD,
    color: PINK[600],
    marginVertical: MARGIN.LG,
    textAlign: 'center',
  },
  footer: {
    marginHorizontal: MARGIN.MD,
    marginBottom: MARGIN.MD,
    justifyContent: 'flex-end',
  },
  image: {
    height: 160,
    resizeMode: 'contain',
    marginTop: MARGIN.XL,
    alignSelf: 'center',
  },
  icon: {
    alignContent: 'center',
    marginHorizontal: MARGIN.MD,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upperContainer: {
    justifyContent: 'flex-start',
  },
});

export default styles;
