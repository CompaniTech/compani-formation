import { StyleSheet } from 'react-native';
import { MARGIN, PADDING } from './metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_REGULAR, FIRA_SANS_ITALIC, FIRA_SANS_MEDIUM } from './fonts';
import { GREY } from './colors';

export default StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: PADDING.LG,
  },
  title: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginBottom: MARGIN.MD,
  },
  italicText: {
    ...FIRA_SANS_ITALIC.MD,
    color: GREY[900],
    textAlign: 'left',
    marginBottom: MARGIN.MD,
  },
  articleTitle: {
    ...FIRA_SANS_MEDIUM.MD,
    color: GREY[900],
    textAlign: 'left',
    marginBottom: MARGIN.SM,
  },
  sectionTitle: {
    ...FIRA_SANS_BOLD.MD,
    color: GREY[900],
    textAlign: 'left',
    marginBottom: MARGIN.SM,
  },
  contentText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    textAlign: 'left',
    marginBottom: MARGIN.MD,
  },
  lastContentText: {
    marginBottom: MARGIN.XXXL,
  },
});
