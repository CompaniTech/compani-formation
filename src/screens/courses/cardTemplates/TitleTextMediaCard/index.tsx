import { useEffect, useState } from 'react';
import { Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import CardHeader from '../../../../components/cards/CardHeader';
import CardFooter from '../../../../components/cards/CardFooter';
import ZoomImage from '../../../../components/ZoomImage';
import FooterGradient from '../../../../components/design/FooterGradient';
import NiVideo from '../../../../components/cards/Video';
import NiAudio from '../../../../components/cards/Audio';
import NiImage from '../../../../components/Image';
import { AUDIO, IMAGE, VIDEO } from '../../../../core/data/constants';
import { useGetCard, useGetCardIndex } from '../../../../store/cards/hooks';
import cardsStyle from '../../../../styles/cards';
import { markdownStyle } from '../../../../styles/common';
import { CARD_MEDIA_MAX_HEIGHT, EDGES } from '../../../../styles/metrics';
import { CacheType } from '../../../../types/CacheType';
import { TitleTextMediaType } from '../../../../types/CardType';
import styles from './styles';

interface TitleTextMediaCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
  setIsLeftSwipeEnabled: (boolean: boolean) => void,
}

const TitleTextMediaCard = ({ isLoading, setIsRightSwipeEnabled, setIsLeftSwipeEnabled }: TitleTextMediaCardProps) => {
  const card: TitleTextMediaType = useGetCard();
  const index = useGetCardIndex();
  const mediaType = card?.media?.type || '';
  const mediaSource = card?.media?.link
    ? { uri: card.media.link, ...(card?.media?.type === IMAGE && { cache: 'force-cache' as CacheType }) }
    : undefined;
  const [mediaHeight, setMediaHeight] = useState<number>(CARD_MEDIA_MAX_HEIGHT);
  const [zoomImage, setZoomImage] = useState<boolean>(false);
  useEffect(() => { setIsRightSwipeEnabled(true); }, [setIsRightSwipeEnabled]);

  const openZoom = () => { 
    setZoomImage(true); 
    setIsRightSwipeEnabled(false); 
    setIsLeftSwipeEnabled(false); 
  };

  const closeZoom = () => { 
    setZoomImage(false); 
    setIsRightSwipeEnabled(true); 
    setIsLeftSwipeEnabled(true);
  };

  useEffect(() => {
    if (!isLoading && card?.media?.link && card?.media?.type === IMAGE) {
      Image.getSize(card.media?.link || '', (width, height) => {
        setMediaHeight(Math.min(height, CARD_MEDIA_MAX_HEIGHT));
      });
    }
  }, [card, isLoading]);

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <CardHeader />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={cardsStyle.title}>{card.title}</Text>
        <Markdown style={markdownStyle(cardsStyle.text)}>{card.text}</Markdown>
        {mediaType === IMAGE && !!mediaSource &&
          <NiImage onPress={openZoom} source={mediaSource} imgHeight={mediaHeight} />}
        {mediaType === VIDEO && !!mediaSource && <NiVideo mediaSource={mediaSource} />}
        {mediaType === AUDIO && !!mediaSource && <NiAudio mediaSource={mediaSource}/>}
      </ScrollView>
      <FooterGradient />
      <CardFooter index={index} />
      {zoomImage && mediaSource &&
        <ZoomImage image={mediaSource} setZoomImage={closeZoom} />}
    </SafeAreaView>
  );
};

export default TitleTextMediaCard;
