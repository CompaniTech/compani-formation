import { Dimensions, PixelRatio, Platform } from 'react-native';
import { Edges } from 'react-native-safe-area-context';
import { IS_IOS } from '../core/data/constants';

const { width, height } = Dimensions.get('window');

export const MAIN_MARGIN_LEFT = 16;
export const MARGIN = {
  XXS: 2,
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 64,
  XXXL: 128,
};

export const PADDING = {
  XS: 2,
  SM: 4,
  MD: 8,
  LG: 16,
  XL: 24,
  XXL: 32,
  XXXL: 64,
};

export const BORDER_WIDTH = 1;
export const BORDER_RADIUS = {
  XS: 5,
  SM: 10,
  MD: 15,
  LG: 20,
  XL: 25,
  XXL: 45,
};

export const ICON = {
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 26,
  XL: 32,
  XXL: 64,
  XXXL: 72,
};

export const IOS_WIDTH_THRESHOLD = 375;
export const ANDROID_PIXEL_DENSITY_THRESHOLD = 2;
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_SCREEN = Platform.select({
  ios: SCREEN_WIDTH < IOS_WIDTH_THRESHOLD,
  android: PixelRatio.get() < ANDROID_PIXEL_DENSITY_THRESHOLD,
  web: SCREEN_WIDTH < IOS_WIDTH_THRESHOLD,
});

export const FONT_SCALE = PixelRatio.getFontScale();

export const INPUT_HEIGHT = 48;
export const GAP_WIDTH = 144 * FONT_SCALE;
export const BUTTON_HEIGHT = 48;
export const ORDERED_ANSWER_MIN_HEIGHT = 64;
export const PROGRESS_BAR_HEIGHT = 8;
export const ABSOLUTE_BOTTOM_POSITION = BUTTON_HEIGHT + MARGIN.XL;
export const IS_DESKTOP_SCREEN = SCREEN_WIDTH > 640;
export const PROGRAM_CELL_WIDTH = IS_DESKTOP_SCREEN ? SCREEN_WIDTH / 2 - 2 * MARGIN.MD : SCREEN_WIDTH - 2 * MARGIN.MD;
export const SLOT_CELL_WIDTH = IS_DESKTOP_SCREEN ? SCREEN_WIDTH / 2 - 4 * MARGIN.MD : SCREEN_WIDTH - 4 * MARGIN.LG;
export const SMALL_SCREEN_MAX_HEIGHT = 568;
export const IS_LARGE_SCREEN = SCREEN_HEIGHT > SMALL_SCREEN_MAX_HEIGHT;
export const TEXT_AREA_HEIGHT = IS_LARGE_SCREEN ? 192 : 80;
export const CARD_MEDIA_MAX_HEIGHT = SCREEN_HEIGHT / 3;
export const TEXT_LINE_HEIGHT = 24;
export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_LABEL_WIDTH = 110;
export const QUESTIONNAIRE_WIDTH = 120;
export const SCROLL_EVENT_THROTTLE = 16;
export const SPINNER_BACKGROUND_HEIGHT = 160;
export const HIT_SLOP = { top: 8, bottom: 8 };
export const BACKGROUND_SPOT_WIDTH = 332;
export const WEB_AUDIO_ICON_SIZE = 250;
export const SMALL_SCREEN_WATERMARK_SIZE = 268;
export const EDGES: Edges = IS_IOS ? ['top'] : ['top', 'bottom'];
