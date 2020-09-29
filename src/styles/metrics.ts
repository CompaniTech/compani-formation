import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const MAIN_MARGIN_LEFT = 16;
export const MARGIN = {
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
};

export const ICON = {
  XS: 16,
  SM: 20,
  MD: 24,
  LG: 26,
  XL: 32,
};

export const IOS_WIDTH_THRESHOLD = 375;
export const ANDROID_PIXEL_DENSITY_THRESHOLD = 2;
export const SCREEN_WIDTH = width < height ? width : height;
export const SCREEN_HEIGHT = width < height ? height : width;
export const IS_SMALL_SCREEN = Platform.select({
  ios: SCREEN_WIDTH < IOS_WIDTH_THRESHOLD,
  android: PixelRatio.get() < ANDROID_PIXEL_DENSITY_THRESHOLD,
});

export const INPUT_HEIGHT = 40;
export const BUTTON_HEIGHT = 48;
export const COURSE_CELL_WIDTH = IS_SMALL_SCREEN ? 230 : 250;
export const TEXT_AREA_HEIGHT = SCREEN_HEIGHT > 568 ? 192 : 80;
