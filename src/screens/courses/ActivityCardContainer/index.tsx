// @ts-nocheck

import { useCallback, useEffect, useRef, useState } from 'react';
import get from 'lodash/get';
import { AppState, AppStateStatus, BackHandler, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Activities from '../../../api/activities';
import { LEARNER, TRAINER, TUTOR } from '../../../core/data/constants';
import { tabsNames } from '../../../core/data/tabs';
import {
  useGetCardIndex,
  useGetCards,
  useGetExitConfirmationModal,
  useResetCardReducer,
  useSetCards,
  useSetExitConfirmationModal,
} from '../../../store/cards/hooks';
import { useSetStatusBarVisible } from '../../../store/main/hooks';
import { ActivityWithCardsType } from '../../../types/ActivityTypes';
import { RootCardParamList, RootStackParamList } from '../../../types/NavigationType';
import CardScreen from '../CardScreen';
import ActivityEndCard from '../cardTemplates/ActivityEndCard';
import StartCard from '../cardTemplates/StartCard';

interface ActivityCardContainerProps extends StackScreenProps<RootStackParamList, 'ActivityCardContainer'> {}

const ActivityCardContainer = ({ route, navigation }: ActivityCardContainerProps) => {
  const setStatusBarVisible = useSetStatusBarVisible();
  const cards = useGetCards();
  const cardIndex = useGetCardIndex();
  const exitConfirmationModal = useGetExitConfirmationModal();
  const setCards = useSetCards();
  const setExitConfirmationModal = useSetExitConfirmationModal();
  const resetCardReducer = useResetCardReducer();
  const [activity, setActivity] = useState<ActivityWithCardsType | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timer = useRef<number>(0);
  const [finalTimer, setFinalTimer] = useState<number>(0);
  const { profileId, mode } = route.params;

  useEffect(() => { setStatusBarVisible(false); }, [setStatusBarVisible]);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const fetchedActivity = await Activities.getActivity(route.params.activityId);
        setActivity(fetchedActivity);
        setCards(fetchedActivity.cards);
      } catch (e: any) {
        console.error(e);
        setActivity(null);
        setCards([]);
      }
    };

    getActivity();
  }, [route.params.activityId, setCards]);

  useEffect(() => {
    async function prefetchImages() {
      const imagesToPrefetch: Promise<boolean>[] = cards
        .filter(c => get(c, 'media.type') === 'image' && !!get(c, 'media.link'))
        .map(c => Image.prefetch(get(c, 'media.link')));

      if (imagesToPrefetch.length) await Promise.all(imagesToPrefetch.map(i => i.catch(e => e)));
    }
    prefetchImages();
  }, [cards]);

  const pauseTimer = useCallback(() => { if (interval.current) clearInterval(interval.current); }, []);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') startTimer();
    else pauseTimer();
  }, [pauseTimer]);

  useEffect(() => {
    const { remove } = AppState.addEventListener('change', handleAppStateChange);
    return () => { remove(); };
  }, [handleAppStateChange]);

  const startTimer = () => {
    interval.current = setInterval(() => { timer.current += 1; }, 1000);
  };

  const stopTimer = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    setFinalTimer(timer.current);
  }, []);

  const navigateNext = useCallback(() => {
    if ([LEARNER, TUTOR].includes(mode)) {
      navigation.navigate('LearnerCourseProfile', { courseId: profileId, endedActivity: activity?._id, mode });
    } else if (mode === TRAINER) navigation.navigate('TrainerCourseProfile', { courseId: profileId });
    else navigation.navigate('SubProgramProfile', { subProgramId: profileId });
  }, [activity?._id, mode, navigation, profileId]);

  const goBack = useCallback(
    async () => {
      if (exitConfirmationModal) setExitConfirmationModal(false);

      stopTimer();
      navigateNext();
      setIsActive(false);
      resetCardReducer();
    },
    [exitConfirmationModal, navigateNext, resetCardReducer, setExitConfirmationModal, stopTimer]
  );

  const hardwareBackPress = useCallback(() => {
    if (cardIndex === null) goBack();
    else setExitConfirmationModal(true);

    return true;
  }, [cardIndex, goBack, setExitConfirmationModal]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  }, [hardwareBackPress]);

  const Tab = createMaterialTopTabNavigator<RootCardParamList>();

  return isActive
    ? <Tab.Navigator tabBar={() => <></>} screenOptions={{ swipeEnabled: false }}>
      <Tab.Screen key={0} name={'startCard'} options={{ title: activity?.name || tabsNames.ActivityCardContainer }}>
        {() => <StartCard title={activity?.name || ''} goBack={goBack} isLoading={!(cards.length > 0 && activity)}
          startTimer={startTimer} />}
      </Tab.Screen>
      {cards.length > 0 && activity &&
        <>
          {cards.map((_, index) => (
            <Tab.Screen key={index} name={`card-${index}`} options={{ title: activity.name }}>
              {() => <CardScreen index={index} goBack={goBack} />}
            </Tab.Screen>
          ))}
          <Tab.Screen key={cards.length + 1} name={`card-${cards.length}`} options={{ title: activity.name }}>
            {() => <ActivityEndCard goBack={goBack} activity={activity} mode={mode} stopTimer={stopTimer}
              finalTimer={finalTimer} />}
          </Tab.Screen>
        </>
      }
    </Tab.Navigator>
    : null;
};

export default ActivityCardContainer;
