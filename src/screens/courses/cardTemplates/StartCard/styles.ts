import { StyleSheet } from 'react-native';
import { MARGIN } from '../../../../styles/metrics';
import { FIRA_SANS_BLACK } from '../../../../styles/fonts';
import { COPPER, WHITE } from '../../../../styles/colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COPPER[500],
  },
  contentContainer: {
    flexGrow: 1,
  },
  wrapper: {
    marginHorizontal: MARGIN.XL,
    justifyContent: 'space-between',
    flex: 1,
  },
  text: {
    ...FIRA_SANS_BLACK.XL,
    color: WHITE,
    marginTop: MARGIN.XXL,
    textAlign: 'center',
  },
  imageBackground: {
    height: 264,
    width: 288,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 128,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  button: {
    marginBottom: MARGIN.XL,
  },
  loader: {
    marginTop: MARGIN.XXL,
  },
});

export default styles;
