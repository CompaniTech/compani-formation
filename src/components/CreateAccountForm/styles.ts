import { StyleSheet } from 'react-native';
import { MARGIN, PADDING } from '../../styles/metrics';
import { FIRA_SANS_ITALIC } from '../../styles/fonts';
import { GREY } from '../../styles/colors';

export default StyleSheet.create({
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
  modalText: {
    ...FIRA_SANS_ITALIC.SM,
    color: GREY[600],
    marginBottom: MARGIN.LG,
  },
  modalLink: {
    textDecorationLine: 'underline',
  },
});
