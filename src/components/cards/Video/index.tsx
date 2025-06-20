// @ts-nocheck

import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { IS_IOS, IS_WEB } from '../../../core/data/constants';
import styles from './styles';

interface NiVideoProps {
  mediaSource: { uri: string } | undefined,
}

const NiVideo = ({ mediaSource }: NiVideoProps) => {
  const player = useVideoPlayer(mediaSource);

  return (
    <View>
      <VideoView style={styles.media} player={player} allowsFullscreen={IS_IOS || IS_WEB} crossOrigin="anonymous" />
    </View>
  );
};

export default NiVideo;
