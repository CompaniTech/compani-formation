import React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import { useIsFocused } from '@react-navigation/native';
import Programs from '../../../api/programs';
import { Context as AuthContext } from '../../../context/AuthContext';
import commonStyles from '../../../styles/common';
import { getLoggedUserId } from '../../../store/main/selectors';
import ProgramCell from '../../../components/ProgramCell';
import styles from './styles';
import { ProgramType } from '../../../types/ProgramType';
import CoursesSection from '../../../components/CoursesSection';
import { GREEN, PINK, YELLOW, PURPLE } from '../../../styles/colors';

interface CatalogProps {
  loggedUserId: string | null,
  navigation: { navigate: (path: string, params: { program: ProgramType }) => {} },
}

const Catalog = ({ loggedUserId, navigation }: CatalogProps) => {
  const [programsByCategories, setProgramsByCategories] = useState<object>({});
  const { signOut } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const style = styles('');
  const CategoriesStyleList = [
    {
      imageBackground: require('../../../../assets/images/yellow_section_background.png'),
      backgroundStyle: style.rightBackground,
      countStyle: { background: YELLOW[200], color: YELLOW[900] },
    },
    {
      imageBackground: require('../../../../assets/images/pink_section_background.png'),
      backgroundStyle: style.leftBackground,
      countStyle: { background: PINK[200], color: PINK[600] },
    },
    {
      imageBackground: require('../../../../assets/images/green_section_background.png'),
      backgroundStyle: style.rightBackground,
      countStyle: { background: GREEN[200], color: GREEN[900] },
    },
    {
      imageBackground: require('../../../../assets/images/purple_section_background.png'),
      backgroundStyle: style.leftBackground,
      countStyle: { background: PURPLE[200], color: PURPLE[800] },
    },
  ];

  const getPrograms = async () => {
    try {
      const fetchedPrograms = await Programs.getELearningPrograms();
      const splittedByCategoryPrograms = fetchedPrograms.map(f => (
        f.categories.map(category => ({
          ...f,
          category: category.name,
        }))
      )).flat();
      setProgramsByCategories(groupBy(splittedByCategoryPrograms, f => f.category));
    } catch (e) {
      if (e.status === 401) signOut();
      console.error(e);
      setProgramsByCategories(() => {});
    }
  };

  useEffect(() => {
    async function fetchData() { await getPrograms(); }
    if (loggedUserId && isFocused) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUserId, isFocused]);

  const goToProgram = program => navigation.navigate('About', { program });

  const renderItem = program => <ProgramCell program={program} onPress={() => goToProgram(program)} />;

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={style.container}>
      <Text style={commonStyles.title}>Explorer</Text>
      {Object.keys(programsByCategories).map((key, i) =>
        <ImageBackground imageStyle={CategoriesStyleList[i % 4].backgroundStyle} style={style.sectionContainer}
          key={`program${i}`} source={CategoriesStyleList[i % 4].imageBackground}>
          <CoursesSection items={programsByCategories[key]} title={key}
            countStyle={styles(CategoriesStyleList[i % 4].countStyle).programsCount} renderItem={renderItem} />
        </ImageBackground>)}
      <View style={style.footer}>
        <Image style={style.elipse} source={require('../../../../assets/images/log_out_background.png')} />
        <Image source={require('../../../../assets/images/aux-detective.png')} style={style.fellow} />
      </View>
    </ScrollView>
  );
};

const mapStateToProps = state => ({ loggedUserId: getLoggedUserId(state) });

export default connect(mapStateToProps)(Catalog);
