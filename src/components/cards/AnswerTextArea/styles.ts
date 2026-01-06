import { StyleSheet } from 'react-native';
import { GREY, PINK, TRANSPARENT_PINK, WHITE } from '../../../styles/colors';
import { BORDER_RADIUS, BORDER_WIDTH, MARGIN, PADDING, TEXT_AREA_HEIGHT } from '../../../styles/metrics';
import { FIRA_SANS_MEDIUM } from '../../../styles/fonts';

const styles = (isSelected: boolean) => StyleSheet.create({
  container: {
    flexGrow: 1,
    maxHeight: isSelected ? TEXT_AREA_HEIGHT : undefined,
    marginBottom: MARGIN.XS,
  },
  input: {
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: BORDER_WIDTH,
    borderColor: isSelected ? PINK[500] : GREY[200],
    padding: PADDING.LG,
    ...FIRA_SANS_MEDIUM.MD,
    color: GREY[900],
    textAlignVertical: 'top',
    flexGrow: 1,
  },
  shadow: {
    backgroundColor: isSelected ? TRANSPARENT_PINK : GREY[200],
    top: isSelected ? -3 : 0,
    bottom: -3,
    right: isSelected ? -3 : 0,
    left: isSelected ? -3 : 0,
    borderRadius: BORDER_RADIUS.SM,
  },
});

export default styles;
