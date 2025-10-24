// @ts-nocheck

import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Questionnaires from '../../../api/questionnaires';
import { tabsNames } from '../../../core/data/tabs';
import { capitalizeFirstLetter, sortStrings } from '../../../core/helpers/utils';
import { getQuestionnaireTitle } from '../../../core/helpers/courses';
import { RootCardParamList, RootStackParamList } from '../../../types/NavigationType';
import { QuestionnaireType } from '../../../types/QuestionnaireType';
import { useSetStatusBarVisible } from '../../../store/main/hooks';
import {
  useGetCardIndex,
  useGetCards,
  useGetExitConfirmationModal,
  useResetCardReducer,
  useSetCards,
  useSetExitConfirmationModal,
} from '../../../store/cards/hooks';
import commonStyles from '../../../styles/common';
import { IS_IOS, LEARNER } from '../../../core/data/constants';
import CardScreen from '../CardScreen';
import QuestionnaireEndCard from '../cardTemplates/QuestionnaireEndCard';
import StartCard from '../cardTemplates/StartCard';

interface QuestionnaireCardContainerProps extends StackScreenProps<RootStackParamList, 'QuestionnaireCardContainer'> {}

const QuestionnaireCardContainer = ({ route, navigation }: QuestionnaireCardContainerProps) => {
  const setStatusBarVisible = useSetStatusBarVisible();
  const cards = useGetCards();
  const cardIndex = useGetCardIndex();
  const exitConfirmationModal = useGetExitConfirmationModal();
  const setCards = useSetCards();
  const setExitConfirmationModal = useSetExitConfirmationModal();
  const resetCardReducer = useResetCardReducer();
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireType[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const { profileId } = route.params;

  useEffect(() => {
    setStatusBarVisible(false);
  }, [setStatusBarVisible]);

  const getQuestionnaires = async () => {
    try {
      const fetchedQuestionnaires = await Questionnaires.getUserQuestionnaires({ course: profileId });
      const sortedQuestionnaires = [...fetchedQuestionnaires].sort((a, b) => sortStrings(a.type, b.type));
      setQuestionnaires(sortedQuestionnaires);
      setCards(sortedQuestionnaires.map(q => q.cards).flat());
      setTitle(capitalizeFirstLetter(getQuestionnaireTitle(sortedQuestionnaires.map(q => q.type))));
    } catch (e: any) {
      console.error(e);
      setQuestionnaires([]);
      setCards([]);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getQuestionnaires();
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = async () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);

    navigation.goBack();
    setIsActive(false);
    resetCardReducer();
  };

  const navigateNext = useCallback(() => {
    navigation
      .popTo('LearnerCourseProfile', { courseId: profileId, endedActivity: questionnaires[0]._id, mode: LEARNER });
  }, [questionnaires, navigation, profileId]);

  const goBackAfterEndQuestionnaire = () => {
    navigateNext();
    setIsActive(false);
    resetCardReducer();
  };

  const hardwareBackPress = () => {
    if (cardIndex === null) goBack();
    else setExitConfirmationModal(true);

    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex]);

  const Tab = createMaterialTopTabNavigator<RootCardParamList>();

  return isActive
    ? <SafeAreaView style={commonStyles.container} edges={IS_IOS ? [] : ['bottom']}>
      <Tab.Navigator tabBar={() => <></>} screenOptions={{ swipeEnabled: false }}>
        <Tab.Screen key={0} name={'startCard'} options={{ title: title || tabsNames.QuestionnaireCardContainer }}>
          {() => <StartCard title={title} goBack={goBack}
            isLoading={!cards.length || !questionnaires.length} />}
        </Tab.Screen>
        {!!cards.length && !!questionnaires.length &&
          <>
            {cards.map((_, index) => (
              <Tab.Screen key={index} name={`card-${index}`} options={{ title }}>
                {() => <CardScreen index={index} goBack={goBack} />}
              </Tab.Screen>
            ))}
            <Tab.Screen key={cards.length + 1} name={`card-${cards.length}`} options={{ title }}>
              {() => <QuestionnaireEndCard goBack={goBackAfterEndQuestionnaire} questionnaires={questionnaires}
                courseId={profileId} />}
            </Tab.Screen>
          </>
        }
      </Tab.Navigator>
    </SafeAreaView>
    : null;
};

export default QuestionnaireCardContainer;
