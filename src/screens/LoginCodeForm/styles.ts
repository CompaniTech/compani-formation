import { StyleSheet } from 'react-native';
import { GREY, PINK, WHITE } from '../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_REGULAR } from '../../styles/fonts';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    marginHorizontal: MARGIN.LG,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  goBack: {
    marginVertical: MARGIN.MD,
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: PADDING.MD,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: MARGIN.MD,
    padding: PADDING.XS,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[600],
  },
  number: {
    ...FIRA_SANS_REGULAR.XXL,
    color: GREY[900],
    marginHorizontal: MARGIN.XXS,
    maxWidth: '25%',
    textAlign: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    ...FIRA_SANS_REGULAR.SM,
    marginBottom: MARGIN.XS,
    color: GREY[600],
  },
  required: {
    ...FIRA_SANS_REGULAR.SM,
    color: PINK[500],
    paddingHorizontal: PADDING.SM,
  },
  input: {
    marginBottom: MARGIN.SM,
  },
  footer: {
    marginBottom: MARGIN.LG,
    justifyContent: 'flex-end',
    flex: 1,
  },
});
