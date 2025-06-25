import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { ICON, WEB_AUDIO_ICON_SIZE } from '../../../styles/metrics';
import IoniconsButton from '../../icons/IoniconsButton';
import { GREY, PINK } from '../../../styles/colors';
import styles from './styles';
import { IS_WEB } from '../../../core/data/constants';

interface NiAudioProps {
  mediaSource: { uri: string } | undefined,
}

const NiAudio = ({ mediaSource }: NiAudioProps) => {
  const player = useAudioPlayer(mediaSource);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (status.didJustFinish) {
      player.pause();
      player.seekTo(0);
    }
  }, [player, status.didJustFinish]);

  const playOrPauseAudio = () => {
    if (status.playing) player.pause();
    else player.play();
  };

  const renderPlayer = (iconSize: number) => (
    <IoniconsButton name={status.playing ? 'pause' : 'play'} size={iconSize} onPress={playOrPauseAudio}
      color={GREY[800]} style={styles.icon} />
  );

  const convertSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes}:${secondsRemaining.toString().padStart(2, '0')}`;
  };

  return (
    IS_WEB
      ? <View style={styles.webContainer}>
        <Ionicons name="musical-note" size={WEB_AUDIO_ICON_SIZE} style={styles.webBackgroundIcon} />
        {renderPlayer(ICON.XXXL)}
        <Text>{convertSeconds(Math.floor(status.currentTime))}/
          {convertSeconds(Math.floor(status.duration) - Math.floor(status.currentTime))}
        </Text>
      </View>
      : <View style={styles.container}>
        {renderPlayer(ICON.MD)}
        <Text style={styles.timer}>{convertSeconds(Math.floor(status.currentTime))}</Text>
        <Slider minimumValue={0} maximumValue={status.duration} minimumTrackTintColor={PINK[500]}
          thumbTintColor={PINK[500]} style={styles.track}
          value={status.currentTime} onValueChange={event => player.seekTo(event)} />
        <Text style={styles.timer}>
          {convertSeconds(Math.floor(status.duration) - Math.floor(status.currentTime))}
        </Text>
      </View>
  );
};

export default NiAudio;
