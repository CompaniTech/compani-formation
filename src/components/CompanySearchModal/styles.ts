import { StyleSheet } from 'react-native';
import { GREY } from '../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, INPUT_HEIGHT, MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_REGULAR, FIRA_SANS_MEDIUM } from '../../styles/fonts';

export default StyleSheet.create({
  input: {
    ...FIRA_SANS_MEDIUM.MD,
    backgroundColor: GREY[100],
    height: INPUT_HEIGHT,
    margin: MARGIN.MD,
    borderRadius: BORDER_RADIUS.SM,
    padding: PADDING.LG,
    color: GREY[900],
    textAlignVertical: 'top',
  },
  placeholder: {
    ...FIRA_SANS_REGULAR.MD,
  },
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
