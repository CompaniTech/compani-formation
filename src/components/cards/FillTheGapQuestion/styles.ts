import { StyleSheet } from 'react-native';
import { GREY, TRANSPARENT_LIGHT_GREY } from '../../../styles/colors';
import {
  INPUT_HEIGHT,
  MARGIN,
  PADDING,
} from '../../../styles/metrics';
import { FIRA_SANS_MEDIUM } from '../../../styles/fonts';

const styles = StyleSheet.create({
  questionContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PADDING.XL,
    paddingHorizontal: PADDING.LG,
    marginBottom: MARGIN.MD,
    backgroundColor: TRANSPARENT_LIGHT_GREY,
  },

  textAndGapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  question: {
    ...FIRA_SANS_MEDIUM.MD,
    lineHeight: INPUT_HEIGHT,
    color: GREY[900],
  },
});

export default styles;
