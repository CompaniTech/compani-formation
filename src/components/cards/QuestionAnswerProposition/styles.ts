import { StyleSheet } from 'react-native';
import { MARGIN, BORDER_WIDTH, BORDER_RADIUS, BUTTON_HEIGHT } from '../../../styles/metrics';
import { WHITE, GREY, COPPER } from '../../../styles/colors';
import { FIRA_SANS_MEDIUM } from '../../../styles/fonts';

const styles = (isSelected: boolean) => StyleSheet.create({
  answerContainer: {
    marginBottom: MARGIN.SM,
  },
  answer: {
    flexDirection: 'row',
    minHeight: BUTTON_HEIGHT,
    borderWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    borderColor: isSelected ? COPPER[500] : GREY[200],
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',

  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    ...FIRA_SANS_MEDIUM.MD,
    color: GREY[800],
    marginVertical: MARGIN.LG / 2,
    marginHorizontal: MARGIN.MD,
  },
  shadow: {
    backgroundColor: isSelected ? COPPER[500] : GREY[200],
    borderRadius: BORDER_RADIUS.LG,
  },
});

export default styles;
