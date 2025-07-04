import { StyleSheet } from 'react-native';
import { FIRA_SANS_BOLD, NUNITO_LIGHT } from '../../../../styles/fonts';
import { GREY, PINK, WHITE } from '../../../../styles/colors';
import {
  BORDER_RADIUS,
  BORDER_WIDTH,
  FONT_SCALE,
  IS_LARGE_SCREEN,
  IS_SMALL_SCREEN,
  MARGIN,
  PADDING,
  SMALL_SCREEN_WATERMARK_SIZE,
} from '../../../../styles/metrics';
import { FlashCardType } from '../../../../types/CardType';

const styles = (card: FlashCardType) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GREY[100],
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    marginHorizontal: MARGIN.LG,
    marginVertical: IS_LARGE_SCREEN ? MARGIN.XXL : MARGIN.LG,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    minHeight: SMALL_SCREEN_WATERMARK_SIZE,
  },
  contentContainer: {
    width: '100%',
    flexGrow: 1,
  },
  flipCard: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: PADDING.LG,
    borderWidth: BORDER_WIDTH,
    borderColor: GREY[200],
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: WHITE,
    backfaceVisibility: 'hidden',
  },
  question: {
    ...card.text.length > 200 && (IS_SMALL_SCREEN || FONT_SCALE > 1) ? FIRA_SANS_BOLD.MD : FIRA_SANS_BOLD.LG,
    color: GREY[900],
    textAlign: 'center',
    alignSelf: 'center',
  },
  questionWatermark: {
    ...IS_LARGE_SCREEN ? NUNITO_LIGHT.XXXL : NUNITO_LIGHT.XXL,
    alignSelf: 'center',
    position: 'absolute',
    color: PINK[100],
  },
  flipCardBack: {
    backgroundColor: PINK[400],
    borderColor: PINK[500],
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
  },
  answer: {
    ...card.backText.length > 200 && (IS_SMALL_SCREEN || FONT_SCALE > 1) ? FIRA_SANS_BOLD.MD : FIRA_SANS_BOLD.LG,
    color: WHITE,
    textAlign: 'center',
  },
  answerWatermark: {
    ...IS_LARGE_SCREEN ? NUNITO_LIGHT.XXXL : NUNITO_LIGHT.XXL,
    alignSelf: 'center',
    position: 'absolute',
    color: PINK[500],
  },
  shadow: {
    backgroundColor: GREY[200],
    borderRadius: BORDER_RADIUS.LG,
  },

});

export default styles;
