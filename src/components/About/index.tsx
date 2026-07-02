import {useCallback, useEffect } from 'react';
import { Image, Text, View, ScrollView, BackHandler, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import get from 'lodash/get';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import commonStyles, { markdownStyle } from '../../styles/common';
import { GREY, TRANSPARENT_GRADIENT } from '../../styles/colors';
import NiPrimaryButton from '../../components/form/PrimaryButton';
import { ProgramType } from '../../types/CourseTypes';
import FooterGradient from '../design/FooterGradient';
import CourseAboutHeader from '../CourseAboutHeader';
import { IS_WEB } from '../../core/data/constants';
import { EDGES } from '../../styles/metrics';

type AboutProps = {
  program: ProgramType,
  buttonCaption?: string,
  children?: any,
  onPress: () => void,
}

const About = ({ program, buttonCaption = 'Continuer', children, onPress }: AboutProps) => {
  const programImage = get(program, 'image.link') || '';
  const source: ImageSourcePropType = programImage
    ? { uri: programImage }
    : require('../../../assets/images/authentication_background_image.webp');
  const navigation = useNavigation();

  const hardwareBackPress = useCallback(() => {
    navigation.goBack();
    return true;
  }, [navigation]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, [hardwareBackPress]);

  return (
    <>
      <SafeAreaView style={commonStyles.container} edges={EDGES}>
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={IS_WEB}>
          <CourseAboutHeader screenTitle='A PROPOS' courseTitle={program.name} goBack={navigation.goBack} />
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={source} />
            </View>
            {!!program.description && <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={commonStyles.sectionContent}>{program.description}</Text>
            </>}
            {!!program.learningGoals && <>
              <Text style={styles.sectionTitle}>Objectifs pédagogiques</Text>
              <Markdown style={markdownStyle(commonStyles.sectionContent)}>{program.learningGoals}</Markdown>
            </>}
          </View>
          {children}
        </ScrollView>
        <View style={styles.footer}>
          <FooterGradient colors={[TRANSPARENT_GRADIENT, GREY[0]]} />
          <NiPrimaryButton caption={buttonCaption} onPress={onPress} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default About;
