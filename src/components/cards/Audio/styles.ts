import { StyleSheet } from 'react-native';
import { GREY, PINK } from '../../../styles/colors';
import { PADDING, MARGIN, SCREEN_HEIGHT, WEB_AUDIO_ICON_SIZE } from '../../../styles/metrics';

const styles = StyleSheet.create({
  container: {
    backgroundColor: GREY[200],
    paddingVertical: PADDING.MD,
    paddingHorizontal: PADDING.MD,
    marginBottom: MARGIN.LG,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  timer: {
    width: '15%',
    textAlign: 'center',
  },
  track: {
    flex: 1,
  },
  webContainer: {
    width: 'auto',
    height: SCREEN_HEIGHT > 3 * WEB_AUDIO_ICON_SIZE ? SCREEN_HEIGHT / 3 : WEB_AUDIO_ICON_SIZE + (2 * PADDING.MD),
    backgroundColor: PINK[100],
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webBackgroundIcon: {
    position: 'absolute',
    opacity: 0.2,
  },
});

export default styles;
