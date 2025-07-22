import { StyleSheet } from 'react-native';
import { GREY, PINK } from './colors';
import { FIRA_SANS_REGULAR, FIRA_SANS_BLACK, FIRA_SANS_MEDIUM } from './fonts';
import { INPUT_HEIGHT, MARGIN, PADDING, TEXT_LINE_HEIGHT } from './metrics';

export default StyleSheet.create({
  title: {
    ...FIRA_SANS_BLACK.XL,
    color: GREY[800],
    marginBottom: MARGIN.MD,
  },
  text: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    marginBottom: MARGIN.XL,
    lineHeight: TEXT_LINE_HEIGHT,
  },
  media: {
    resizeMode: 'contain',
  },
  question: {
    ...FIRA_SANS_MEDIUM.LG,
    color: GREY[900],
    marginBottom: MARGIN.XL,
    marginHorizontal: MARGIN.LG,
  },
  explanation: {
    minHeight: INPUT_HEIGHT,
    paddingHorizontal: PADDING.XL,
    paddingVertical: PADDING.LG,
  },
  informativeText: {
    ...FIRA_SANS_REGULAR.SM,
    color: PINK[500],
    marginBottom: MARGIN.SM,
  },
});
