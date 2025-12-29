import { useState, useEffect, useMemo } from 'react';
import { Text, ScrollView, ImageBackground, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import groupBy from 'lodash/groupBy';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import get from 'lodash/get';
import escapeRegExp from 'lodash/escapeRegExp';
import { RootBottomTabParamList, RootStackParamList } from '../../../types/NavigationType';
import Programs from '../../../api/programs';
import { ELearningProgramType } from '../../../types/CourseTypes';
import { ElearningProgramType } from '../../../types/AxiosTypes';
import commonStyles from '../../../styles/common';
import { useGetLoggedUserId } from '../../../store/main/hooks';
import ProgramCell from '../../../components/ProgramCell';
import styles from './styles';
import CoursesSection from '../../../components/CoursesSection';
import HomeScreenFooter from '../../../components/HomeScreenFooter';
import { GREEN, PINK, YELLOW, PURPLE, GREY } from '../../../styles/colors';
import { capitalizeFirstLetter, getTheoreticalDuration, removeDiacritics } from '../../../core/helpers/utils';
import { IS_WEB } from '../../../core/data/constants';

interface CatalogProps extends CompositeScreenProps<
StackScreenProps<RootBottomTabParamList>,
StackScreenProps<RootStackParamList>
> {}

const CategoriesStyleList = [
  {
    imageBackground: require('../../../../assets/images/yellow_section_background.webp'),
    backgroundStyle: styles().leftBackground,
    countStyle: { background: YELLOW[200], color: YELLOW[900] },
  },
  {
    imageBackground: require('../../../../assets/images/green_section_background.webp'),
    backgroundStyle: styles().rightBackground,
    countStyle: { background: GREEN[200], color: GREEN[900] },
  },
  {
    imageBackground: require('../../../../assets/images/purple_section_background.webp'),
    backgroundStyle: styles().leftBackground,
    countStyle: { background: PURPLE[200], color: PURPLE[800] },
  },
  {
    imageBackground: require('../../../../assets/images/pink_section_background.webp'),
    backgroundStyle: styles().rightBackground,
    countStyle: { background: PINK[200], color: PINK[600] },
  },
];

const Catalog = ({ navigation }: CatalogProps) => {
  const loggedUserId = useGetLoggedUserId();

  const [programs, setPrograms] = useState<ElearningProgramType[]>([]);
  const [answer, setAnswer] = useState<string>('');
  const isFocused = useIsFocused();
  const style = styles();

  const filteredProgramsByCategories = useMemo(() => {
    if (!answer) {
      const splittedByCategoryPrograms = programs.map(f => (
        f.categories.map(category => ({ ...f, category: category.name }))
      )).flat();
      return groupBy(splittedByCategoryPrograms, f => f.category);
    }

    const normalizedAnswer = escapeRegExp(removeDiacritics(answer.toLowerCase()));
    const splittedByCategoryPrograms = programs
      .filter(program => escapeRegExp(removeDiacritics(program.name.toLowerCase())).includes(normalizedAnswer))
      .map(f => (
        f.categories.map(category => ({ ...f, category: category.name }))
      )).flat();
    return groupBy(splittedByCategoryPrograms, f => f.category);
  }, [answer, programs]);

  const getPrograms = async () => {
    try {
      const fetchedPrograms = await Programs.getELearningPrograms();
      setPrograms(fetchedPrograms);
    } catch (e: any) {
      console.error(e);
      setPrograms([]);
    }
  };

  useEffect(() => {
    async function fetchData() { await getPrograms(); }
    if (isFocused) {
      fetchData();
    }
  }, [loggedUserId, isFocused]);

  const goToProgram = (program: ELearningProgramType) => navigation.navigate('ElearningAbout', { program });

  const renderItem = (program: ELearningProgramType) => <ProgramCell onPress={() => goToProgram(program)}
    program={program} theoreticalDuration={getTheoreticalDuration(get(program, 'subPrograms[0].steps'))} />;

  return (
    <SafeAreaView style={commonStyles.container} edges={[]}>
      <ScrollView contentContainerStyle={style.container} showsVerticalScrollIndicator={IS_WEB}>
        <Text style={commonStyles.title}>Explorer</Text>
        <TextInput placeholder="Chercher une formation" value={answer} onChangeText={setAnswer}
          style={!answer ? [style.input, style.placeholder] : style.input} placeholderTextColor={GREY[600]} />
        {Object.keys(filteredProgramsByCategories).map((key, i) =>
          <ImageBackground imageStyle={CategoriesStyleList[i % 4].backgroundStyle} style={style.sectionContainer}
            key={`program${i}`} source={CategoriesStyleList[i % 4].imageBackground}>
            <CoursesSection items={filteredProgramsByCategories[key]} title={capitalizeFirstLetter(key)}
              countStyle={styles(CategoriesStyleList[i % 4].countStyle).programsCount} renderItem={renderItem} />
          </ImageBackground>)}
        <HomeScreenFooter source={require('../../../../assets/images/aux_detective.webp')} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Catalog;
