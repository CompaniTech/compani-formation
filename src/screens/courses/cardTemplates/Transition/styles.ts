import { StyleSheet } from 'react-native';
import { COPPER, WHITE } from '../../../../styles/colors';
import { MARGIN } from '../../../../styles/metrics';
import { NUNITO_REGULAR_BOLD_ITALIC } from '../../../../styles/fonts';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COPPER[500],
  },
  closeButton: {
    margin: MARGIN.MD,
  },
  titleContainer: {
    marginTop: MARGIN.XL,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    ...NUNITO_REGULAR_BOLD_ITALIC.XL,
    textAlign: 'center',
    color: WHITE,
    marginHorizontal: MARGIN.MD,
  },
});

export default styles;
