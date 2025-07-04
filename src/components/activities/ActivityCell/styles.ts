import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR, NUNITO_SEMI } from '../../../styles/fonts';
import { GREY, WHITE } from '../../../styles/colors';
import { BORDER_RADIUS, PADDING } from '../../../styles/metrics';
import { ColorStateType } from './types';

const styles = (checkBackgroundColor: ColorStateType['check']) => StyleSheet.create({
  container: {
    display: 'flex',
    width: 128,
    alignItems: 'center',
  },
  activityName: {
    ...FIRA_SANS_REGULAR.MD,
    color: GREY[900],
    textAlign: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: PADDING.XS,
    overflow: 'hidden',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 0,
    left: '70%',
    backgroundColor: checkBackgroundColor,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 2,
    borderColor: WHITE,
  },
  score: {
    ...NUNITO_SEMI.SM,
    color: WHITE,
    paddingHorizontal: PADDING.SM,
  },
});

export default styles;
