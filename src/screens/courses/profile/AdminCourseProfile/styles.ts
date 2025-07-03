import { StyleSheet } from 'react-native';
import { WHITE, GREY, YELLOW } from '../../../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, ICON, MARGIN, PADDING } from '../../../../styles/metrics';
import { FIRA_SANS_BOLD, FIRA_SANS_ITALIC, FIRA_SANS_REGULAR } from '../../../../styles/fonts';

const styles = StyleSheet.create({
  sectionTitle: {
    ...FIRA_SANS_BOLD.LG,
    color: GREY[900],
    marginBottom: MARGIN.MD,
  },
  sectionContainer: {
    marginHorizontal: MARGIN.MD,
  },
  footer: {
    paddingVertical: PADDING.LG,
  },
  italicText: {
    ...FIRA_SANS_ITALIC.MD,
    color: GREY[600],
    marginBottom: MARGIN.MD,
  },
  uploadButton: {
    marginVertical: MARGIN.MD,
  },
  editButton: {
    position: 'absolute',
    top: -8,
    right: 0,
    borderRadius: BORDER_RADIUS.XXL,
    borderColor: GREY[200],
    borderWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    padding: PADDING.MD,
  },
  savedSheetContent: {
    marginHorizontal: MARGIN.MD,
    alignItems: 'center',
    paddingTop: PADDING.MD,
    maxWidth: ICON.XXL + PADDING.XXL,
  },
  savedSheetText: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    textAlign: 'center',
  },
  attendancesContainer: {
    marginTop: MARGIN.LG,
  },
  listContainer: {
    marginBottom: MARGIN.MD,
  },
  titleContainer: {
    marginHorizontal: MARGIN.MD,
  },
  uploadContainer: {
    backgroundColor: YELLOW[100],
    marginBottom: MARGIN.LG,
    borderColor: GREY[200],
    borderBottomWidth: BORDER_WIDTH,
  },
  header: {
    backgroundColor: YELLOW[300],
    flexDirection: 'row',
    paddingHorizontal: PADDING.LG,
    paddingVertical: PADDING.MD,
    ...FIRA_SANS_ITALIC.SM,
    color: GREY[900],
  },
  attendanceSheetButton: {
    marginHorizontal: MARGIN.MD,
    marginBottom: MARGIN.SM,
  },
});

export default styles;
