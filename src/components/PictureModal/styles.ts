import { StyleSheet } from 'react-native';
import { COPPER } from '../../styles/colors';
import { PADDING } from '../../styles/metrics';
import { FIRA_SANS_MEDIUM } from '../../styles/fonts';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FIRA_SANS_MEDIUM.MD,
    color: COPPER[500],
  },
  loading: {
    paddingHorizontal: PADDING.SM,
    position: 'absolute',
    right: 40,
  },
  goBack: {
    alignSelf: 'flex-end',
  },
});

export default styles;
