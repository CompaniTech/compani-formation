import { StyleSheet } from 'react-native';
import { PINK, WHITE } from '../../styles/colors';
import { FIRA_SANS_BOLD } from '../../styles/fonts';
import { MARGIN, TAB_BAR_HEIGHT, TAB_BAR_LABEL_WIDTH } from '../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
  },
  iconContainer: {
    alignItems: 'center',
    width: TAB_BAR_LABEL_WIDTH,
    marginVertical: MARGIN.SM,
  },
  iconText: {
    ...FIRA_SANS_BOLD.SM,
    color: PINK[500],
    textAlign: 'center',
  },
});

export default styles;
