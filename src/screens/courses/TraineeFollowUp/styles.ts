import { StyleSheet } from 'react-native';
import { MARGIN, PADDING } from '../../../styles/metrics';
import { GREY } from '../../../styles/colors';
import { FIRA_SANS_BLACK, FIRA_SANS_BOLD, NUNITO_SEMI } from '../../../styles/fonts';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  header: {
    paddingTop: PADDING.LG,
    paddingHorizontal: PADDING.LG,
    alignItems: 'center',
    flexDirection: 'row',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    marginHorizontal: MARGIN.LG,
    marginVertical: MARGIN.MD,
  },
  title: {
    ...FIRA_SANS_BLACK.XL,
    marginBottom: MARGIN.MD,
  },
  progressContainer: {
    flexDirection: 'row',
    marginVertical: MARGIN.MD,
    alignItems: 'center',
  },
  progressBarText: {
    ...NUNITO_SEMI.XS,
    color: GREY[600],
  },
  totalProgress: {
    ...FIRA_SANS_BOLD.LG,
  },
  stepContainer: {
    flexDirection: 'row',
    marginVertical: MARGIN.SM,
    alignItems: 'center',
  },
  stepTitle: {
    ...FIRA_SANS_BOLD.SM,
    width: '60%',
  },
});

export default styles;
