import { StyleSheet } from 'react-native';
import { BORDER_WIDTH, MARGIN } from '../../../styles/metrics';
import { GREY, COPPER } from '../../../styles/colors';
import { NUNITO_SEMI, FIRA_SANS_REGULAR } from '../../../styles/fonts';

export default StyleSheet.create({
  separator: {
    height: 16,
    borderLeftWidth: BORDER_WIDTH,
    borderLeftColor: GREY[300],
    marginHorizontal: MARGIN.SM,
    alignSelf: 'center',
  },
  date: {
    ...NUNITO_SEMI.XS,
    color: GREY[600],
    textTransform: 'uppercase',
  },
  location: {
    ...FIRA_SANS_REGULAR.MD,
    color: COPPER[600],
    textDecorationLine: 'underline',
  },
});
