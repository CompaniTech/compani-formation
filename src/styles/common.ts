// @ts-nocheck

import { StyleSheet } from 'react-native';
import { MARGIN, MAIN_MARGIN_LEFT, PROGRESS_BAR_HEIGHT, BORDER_WIDTH } from './metrics';
import { WHITE, PINK, GREY } from './colors';
import { FIRA_SANS_BLACK, FIRA_SANS_BOLD, FIRA_SANS_ITALIC, FIRA_SANS_REGULAR } from './fonts';

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    ...FIRA_SANS_BLACK.XL,
    color: GREY[900],
    marginLeft: MAIN_MARGIN_LEFT,
    marginVertical: MARGIN.XL,
  },
  sectionTitle: {
    flexDirection: 'row',
    marginBottom: MARGIN.MD,
  },
  iconButton: {
    zIndex: 100,
  },
  progressBarContainer: {
    marginHorizontal: MARGIN.MD,
    flex: 1,
    height: PROGRESS_BAR_HEIGHT,
  },
  sectionDelimiter: {
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    marginBottom: MARGIN.MD,
    justifyContent: 'center',
  },
  sectionContent: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[800],
    marginBottom: MARGIN.MD,
  },
});

export const markdownStyle = bodyStyle => ({
  body: bodyStyle,
  strong: { ...FIRA_SANS_BOLD.MD },
  em: { ...FIRA_SANS_ITALIC.MD },
  list_item: { margin: MARGIN.XS },
  link: { color: PINK[500] },
});
