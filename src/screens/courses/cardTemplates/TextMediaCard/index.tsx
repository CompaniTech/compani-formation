import { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import CardHeader from '../../../../components/cards/CardHeader';
import CardFooter from '../../../../components/cards/CardFooter';
import ZoomImage from '../../../../components/ZoomImage';
import FooterGradient from '../../../../components/design/FooterGradient';
import NiVideo from '../../../../components/cards/Video';
import NiAudio from '../../../../components/cards/Audio';
import NiImage from '../../../../components/Image';
import { IMAGE, VIDEO, AUDIO } from '../../../../core/data/constants';
import { useGetCard, useGetCardIndex } from '../../../../store/cards/hooks';
import cardsStyle from '../../../../styles/cards';
import { markdownStyle } from '../../../../styles/common';
import { CARD_MEDIA_MAX_HEIGHT, EDGES } from '../../../../styles/metrics';
import { TextMediaType } from '../../../../types/CardType';
import { CacheType } from '../../../../types/CacheType';
import styles from './styles';

interface TextMediaCardProps {
  isLoading: boolean,
  setIsRightSwipeEnabled: (boolean: boolean) => void,
  setIsLeftSwipeEnabled: (boolean: boolean) => void,
}

const TextMediaCard = ({ isLoading, setIsRightSwipeEnabled, setIsLeftSwipeEnabled }: TextMediaCardProps) => {
  const card: TextMediaType = useGetCard();
  const index = useGetCardIndex();

  const [mediaHeight, setMediaHeight] = useState<number>(CARD_MEDIA_MAX_HEIGHT);
  const [mediaType, setMediaType] = useState<string>('');
  const [mediaSource, setMediaSource] = useState<{ uri: string, cache?: CacheType } | undefined>();
  const [zoomImage, setZoomImage] = useState<boolean>(false);

  useEffect(() => setIsRightSwipeEnabled(true));
  useEffect(() => {
    setIsRightSwipeEnabled(!zoomImage);
    setIsLeftSwipeEnabled(!zoomImage);
  }, [zoomImage, setIsRightSwipeEnabled, setIsLeftSwipeEnabled]);

  useEffect(() => {
    if (!isLoading) {
      if (card?.media?.link && card?.media?.type === IMAGE) {
        Image.getSize(card.media?.link || '', (width, height) => {
          setMediaHeight(Math.min(height, CARD_MEDIA_MAX_HEIGHT));
        });
      }
      setMediaType(card?.media?.type);
      setMediaSource(card.media?.link
        ? { uri: card.media.link, ...(card?.media?.type === IMAGE && { cache: 'force-cache' }) }
        : undefined);
    }
  }, [card, isLoading]);

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={EDGES}>
      <CardHeader />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Markdown style={markdownStyle(cardsStyle.text)}>{card.text}</Markdown>
        {mediaType === IMAGE && !!mediaSource &&
          <NiImage onPress={() => setZoomImage(true)} source={mediaSource} imgHeight={mediaHeight} />}
        {mediaType === VIDEO && !!mediaSource && <NiVideo mediaSource={mediaSource} />}
        {mediaType === AUDIO && !!mediaSource && <NiAudio mediaSource={mediaSource} />}
      </ScrollView>
      <FooterGradient />
      <CardFooter index={index} />
      {zoomImage && mediaSource &&
        <ZoomImage image={mediaSource} setZoomImage={setZoomImage} />}
    </SafeAreaView>
  );
};

export default TextMediaCard;
