import { StyleSheet } from 'react-native';
import { GREY, COPPER } from '../../styles/colors';
import { MARGIN } from '../../styles/metrics';
import { FIRA_SANS_REGULAR, FIRA_SANS_BOLD, FIRA_SANS_MEDIUM, FIRA_SANS_ITALIC } from '../../styles/fonts';

const styles = StyleSheet.create({
  title: {
    ...FIRA_SANS_BOLD.LG,
    marginBottom: MARGIN.MD,
    color: GREY[900],
  },
  identity: {
    ...FIRA_SANS_MEDIUM.LG,
    color: GREY[900],
    flexWrap: 'wrap',
    flex: 1,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MARGIN.SM,
  },
  contactContent: {
    flex: 1,
    ...FIRA_SANS_REGULAR.MD,
    color: COPPER[500],
    marginLeft: MARGIN.MD,
    textDecorationLine: 'underline',
  },
  italicText: {
    ...FIRA_SANS_ITALIC.MD,
    color: GREY[600],
    marginBottom: MARGIN.MD,
  },
});

export default styles;
