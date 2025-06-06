import { StyleSheet } from 'react-native';
import { GREY } from '../../styles/colors';
import { BORDER_RADIUS, MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_BOLD } from '../../styles/fonts';

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'space-between',
  },
  content: {
    marginHorizontal: MARGIN.MD,
  },
  sectionTitle: {
    ...FIRA_SANS_BOLD.LG,
    marginBottom: MARGIN.SM,
    color: GREY[900],
  },
  imageContainer: {
    marginTop: -MARGIN.LG,
    marginBottom: MARGIN.MD,
    height: 160,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: BORDER_RADIUS.MD,
  },
  footer: {
    paddingBottom: PADDING.XXL,
    paddingHorizontal: PADDING.XL,
  },
});

export default styles;
