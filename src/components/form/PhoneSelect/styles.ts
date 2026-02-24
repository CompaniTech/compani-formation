import { StyleSheet } from 'react-native';
import { MARGIN } from '../../../styles/metrics';
import { GREY, ORANGE } from '../../../styles/colors';
import { FIRA_SANS_ITALIC, FIRA_SANS_REGULAR } from '../../../styles/fonts';
import { IS_WEB } from '../../../core/data/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    flexShrink: 1,
  },
  unvalid: {
    ...FIRA_SANS_ITALIC.SM,
    color: ORANGE[600],
    ...(!IS_WEB && { marginTop: -MARGIN.MD }),
    marginBottom: MARGIN.MD,
  },
  caption: {
    ...FIRA_SANS_REGULAR.SM,
    ...(!IS_WEB && { marginBottom: -MARGIN.MD }),
    color: GREY[600],
  },
});

export default styles;
