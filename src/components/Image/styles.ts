import { StyleSheet } from 'react-native';
import { MARGIN } from '../../styles/metrics';

const styles = (imgHeight: number) => StyleSheet.create({
  media: {
    height: imgHeight,
    marginBottom: MARGIN.LG,
  },
  spinnerContainer: {
    alignItems: 'center',
  },
});

export default styles;
