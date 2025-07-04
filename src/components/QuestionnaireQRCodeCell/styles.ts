import { StyleSheet } from 'react-native';
import { GREY, PINK } from '../../styles/colors';
import { FIRA_SANS_REGULAR, NUNITO_LIGHT } from '../../styles/fonts';
import { BORDER_RADIUS, MARGIN, PADDING } from '../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    padding: PADDING.LG,
    backgroundColor: GREY[0],
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: MARGIN.XL,
  },
  title: {
    ...NUNITO_LIGHT.LG,
    color: GREY[900],
    textAlign: 'center',
    paddingBottom: PADDING.LG,
  },
  image: {
    resizeMode: 'cover',
    width: 152,
    height: 152,
    alignSelf: 'center',
  },
  link: {
    flex: 1,
    ...FIRA_SANS_REGULAR.MD,
    color: PINK[500],
    textDecorationLine: 'underline',
    paddingTop: PADDING.LG,
    textAlign: 'center',
  },
});

export default styles;
