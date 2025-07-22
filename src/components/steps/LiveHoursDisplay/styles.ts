import { StyleSheet } from 'react-native';
import { MARGIN } from '../../../styles/metrics';
import { FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { GREY } from '../../../styles/colors';

const styles = StyleSheet.create({
  datesAndArrowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hours: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
  },
  arrow: {
    marginHorizontal: MARGIN.XS,
    marginTop: MARGIN.XS,
  },
});

export default styles;
