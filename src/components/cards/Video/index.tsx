// @ts-nocheck

import { useState } from 'react';
import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { IS_IOS, IS_WEB } from '../../../core/data/constants';
import { ICON } from '../../../styles/metrics';
import FeatherButton from '../../../components/icons/FeatherButton';
import { GREY } from '../../../styles/colors';
import styles from './styles';

interface NiVideoProps {
  mediaSource: { uri: string } | undefined,
}

const NiVideo = ({ mediaSource }: NiVideoProps) => {
  const player = useVideoPlayer(mediaSource);
  const [playVisible, setPlayVisible] = useState<boolean>(IS_IOS);

  const firstPlayOnIOS = () => {
    player.play();
    setPlayVisible(false);
  };

  return (
    <View>
      {IS_IOS && playVisible &&
        <FeatherButton name='play-circle' size={ICON.XXL} onPress={firstPlayOnIOS} color={GREY[100]}
          style={styles.play} />}
      <VideoView style={styles.media} player={player} allowsFullscreen={IS_IOS || IS_WEB} crossOrigin="anonymous" />
    </View>
  );
};

export default NiVideo;
