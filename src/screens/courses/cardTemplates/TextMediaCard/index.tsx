import React, { useEffect, useState } from 'react';
import { Text, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { connect } from 'react-redux';
import CardHeader from '../../../../components/cards/CardHeader';
import CardFooter from '../../../../components/cards/CardFooter';
import Selectors from '../../../../store/activities/selectors';
import cardsStyle from '../../../../styles/cards';
import { StateType } from '../../../../types/store/StoreType';
import { TextMediaType } from '../../../../types/CardType';
import styles from './styles';
import { CARD_MEDIA_MAX_HEIGHT } from '../../../../styles/metrics';
import FooterGradient from '../../../../components/design/FooterGradient';
import { IMAGE, VIDEO } from '../../../../core/data/constants';

interface TextMediaCardProps {
  card: TextMediaType,
  index: number,
  isLoading: boolean,
}

const TextMediaCard = ({ card, index, isLoading }: TextMediaCardProps) => {
  const [mediaHeight, setMediaHeight] = useState(CARD_MEDIA_MAX_HEIGHT);

  useEffect(() => {
    if (!isLoading && card?.media?.link && card?.media?.type === IMAGE) {
      Image.getSize(card.media?.link || '', (width, height) => {
        setMediaHeight(Math.min(height, CARD_MEDIA_MAX_HEIGHT));
      });
    }
  }, [card, isLoading]);

  if (isLoading) return null;

  const mediaSource = card.media?.link ? { uri: card.media.link } : '';
  const cardType = card?.media?.type;
  const styleWithHeight = styles(mediaHeight);

  return (
    <>
      <CardHeader />
      <ScrollView style={styleWithHeight.container} showsVerticalScrollIndicator={false}>
        <Text style={cardsStyle.text}>{card.text}</Text>
        {cardType === IMAGE && !!mediaSource &&
          <Image source={mediaSource} style={[cardsStyle.media, styleWithHeight.media]} />}
        {cardType === VIDEO && !!mediaSource &&
            <Video useNativeControls resizeMode='cover' source={mediaSource} style={styleWithHeight.media} />}
      </ScrollView>
      <FooterGradient />
      <CardFooter index={index} />
    </>
  );
};

const mapStateToProps = (state: StateType) => ({ card: Selectors.getCard(state), index: state.activities.cardIndex });

export default connect(mapStateToProps)(TextMediaCard);
