import { StyleSheet } from 'react-native';
import { GREY } from '../../styles/colors';
import { BORDER_WIDTH, MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_REGULAR } from '../../styles/fonts';

export default StyleSheet.create({
  company: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    marginHorizontal: MARGIN.MD,
  },
  holding: {
    ...FIRA_SANS_REGULAR.SM,
    marginHorizontal: MARGIN.MD,
    color: GREY[500],
  },
  separator: {
    borderTopWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    paddingVertical: PADDING.LG,
  },
});
