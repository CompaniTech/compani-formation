import { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { TRANSPARENT_GRADIENT, WHITE } from '../../styles/colors';
import BottomModal from '../BottomModal';
import { markdownStyle } from '../../styles/common';
import { INPUT_HEIGHT } from '../../styles/metrics';
import { internalRulesArticles } from '../../core/data/rules';
import FooterGradient from '../design/FooterGradient';
import styles from '../../styles/rulesModal';
import { IS_WEB } from '../../core/data/constants';

interface InternalRulesModalProps {
  onRequestClose: () => void,
  visible: boolean,
}

const InternalRulesModal = ({ onRequestClose, visible }: InternalRulesModalProps) => {
  const [scrollKey, setScrollKey] = useState<number>(0);

  useEffect(() => {
    if (visible) setScrollKey(k => k + 1);
  }, [visible]);

  return (
    <BottomModal onRequestClose={onRequestClose} visible={visible}>
      <View style={styles.content}>
        <Text style={styles.title}>Règlement intérieur</Text>
        <ScrollView showsVerticalScrollIndicator={IS_WEB} key={scrollKey}>
          <Text style={styles.italicText}>
            Règlement intérieur établi conformément aux articles
            L6352-3 et L6352-4 et R6352-1 à R6352-15 du Code du travail
          </Text>
          <Text style={styles.articleTitle}>Article 1 - Objet et champ d’application du règlement</Text>
          <Text style={styles.contentText}>{internalRulesArticles[1]}</Text>
          <Text style={styles.sectionTitle}>SECTION 1 : RÈGLES D’HYGIÈNE ET DE SÉCURITÉ</Text>
          <Text style={styles.articleTitle}>Article 2 - Principes généraux</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[2]}</Markdown>
          <Text style={styles.articleTitle}>Article 3 - Consignes d’incendie</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[3]}</Markdown>
          <Text style={styles.articleTitle}>Article 4 - Boissons alcoolisées et drogues</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[4]}</Markdown>
          <Text style={styles.articleTitle}>Article 5 - Interdiction de fumer</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[5]}</Markdown>
          <Text style={styles.articleTitle}>Article 6 - Accident</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[6]}</Markdown>
          <Text style={styles.articleTitle}>Article 7 - Assiduité du stagiaire en formation</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[7]}</Markdown>
          <Text style={styles.articleTitle}>
            Article 8 - Accès aux locaux de formation (si la formation est effectuée dans les locaux de l’organisme
            de formation)
          </Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[8]}</Markdown>
          <Text style={styles.articleTitle}>Article 9 - Tenue</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[9]}</Markdown>
          <Text style={styles.articleTitle}>Article 10 - Comportement</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[10]}</Markdown>
          <Text style={styles.articleTitle}>Article 11 - Utilisation du matériel</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[11]}</Markdown>
          <Text style={styles.sectionTitle}>SECTION 3 : MESURES DISCIPLINAIRES</Text>
          <Text style={styles.articleTitle}>Article 12 - Sanctions disciplinaires</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[12]}</Markdown>
          <Text style={styles.articleTitle}>Article 13 - Garanties disciplinaires</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[13]}</Markdown>
          <Text style={styles.sectionTitle}>SECTION 4 : REPRÉSENTATION DES STAGIAIRES</Text>
          <Text style={styles.articleTitle}>Article 14 - Organisation des élections</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[14]}</Markdown>
          <Text style={styles.articleTitle}>Article 15 - Durée du mandat des délégués des stagiaires</Text>
          <Markdown style={markdownStyle(styles.contentText)}>{internalRulesArticles[15]}</Markdown>
          <Text style={styles.articleTitle}>Article 16 - Rôle des délégués des stagiaires</Text>
          <Markdown style={markdownStyle({ ...styles.contentText, ...styles.lastContentText })}>
            {internalRulesArticles[16]}
          </Markdown>
        </ScrollView>
      </View>
      <FooterGradient colors={[TRANSPARENT_GRADIENT, WHITE]} bottomPosition={0} height={INPUT_HEIGHT}/>
    </BottomModal>
  );
};

export default InternalRulesModal;
