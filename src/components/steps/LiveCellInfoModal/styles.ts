import { StyleSheet } from 'react-native';
import { BORDER_WIDTH, MARGIN } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import { NUNITO_SEMI, FIRA_SANS_BOLD } from '../../../styles/fonts';

export default StyleSheet.create({
  stepInfoSeparator: {
    marginBottom: MARGIN.MD,
  },
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: MARGIN.XL,
  },
  title: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[900],
    flex: 1,
  },
  closeButton: {
    alignItems: 'flex-end',
  },
});
