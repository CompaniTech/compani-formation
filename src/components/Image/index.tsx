import { useState } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import cardsStyle from '../../styles/cards';
import Spinner from '../Spinner';
import styles from './styles';

interface NiImageProps {
  source: { uri: string },
  imgHeight: number,
  onPress: () => void,
}

const NiImage = ({ source, imgHeight, onPress }: NiImageProps) => {
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const style = styles(imgHeight);

  return (
    <>
      {isMediaLoading && <View style={style.spinnerContainer}>
        <Spinner />
      </View>}
      <TouchableOpacity onPress={onPress}>
        <Image source={source} style={[cardsStyle.media, style.media]}
          onLoad={() => setIsMediaLoading(false)}
          onError={() => setIsMediaLoading(false)} />
      </TouchableOpacity>
    </>
  );
};

export default NiImage;
