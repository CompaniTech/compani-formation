import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  BackHandler,
  ImageSourcePropType,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { LinearGradient } from 'expo-linear-gradient';
import SubPrograms from '../../../../api/subPrograms';
import { GREY, WHITE } from '../../../../styles/colors';
import { EDGES, ICON } from '../../../../styles/metrics';
import FeatherButton from '../../../../components/icons/FeatherButton';
import { TESTER } from '../../../../core/data/constants';
import commonStyles from '../../../../styles/common';
import styles from './styles';
import { useSetStatusBarVisible } from '../../../../store/main/hooks';
import { RootStackParamList, RootBottomTabParamList } from '../../../../types/NavigationType';
import { SubProgramType } from '../../../../types/CourseTypes';
import { renderFooter, renderStepList } from '../helper';

interface SubProgramProfileProps extends CompositeScreenProps<
StackScreenProps<RootStackParamList, 'SubProgramProfile'>,
StackScreenProps<RootBottomTabParamList>
> {
}

const SubProgramProfile = ({ route, navigation }: SubProgramProfileProps) => {
  const setStatusBarVisible = useSetStatusBarVisible();

  const [subProgram, setSubProgram] = useState<SubProgramType | null>(null);
  const [source, setSource] =
    useState<ImageSourcePropType>(require('../../../../../assets/images/authentication_background_image.webp'));
  const [programName, setProgramName] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgramName(get(subProgram, 'program.name') || '');

    const programImage = get(subProgram, 'program.image.link') || '';
    if (programImage) setSource({ uri: programImage });
    else setSource(require('../../../../../assets/images/authentication_background_image.webp'));
  }, [subProgram]);

  const getSubProgram = useCallback(async () => {
    try {
      const fetchedSubProgram = await SubPrograms.getSubProgram(route.params.subProgramId);
      if (!isEqual(fetchedSubProgram, subProgram)) setSubProgram(fetchedSubProgram);
      setRefreshing(false);
      setIsLoaded(true);
    } catch (e: any) {
      console.error(e);
      setSubProgram(null);
    }
  }, [route.params.subProgramId, subProgram]);

  useEffect(() => { getSubProgram(); }, [getSubProgram]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setStatusBarVisible(true);
      if (!isLoaded) getSubProgram();
    }
  }, [getSubProgram, isFocused, setStatusBarVisible, isLoaded]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const hardwareBackPress = useCallback(() => {
    goBack();
    return true;
  }, [goBack]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { subscription.remove(); };
  }, [hardwareBackPress, isFocused]);

  const renderHeader = () => <ImageBackground source={source} imageStyle={styles.image}>
    <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.4)']} style={styles.gradient} />
    <View style={styles.header}>
      <FeatherButton style={styles.arrow} onPress={goBack} name="arrow-left" color={WHITE} size={ICON.MD}
        iconStyle={styles.arrowShadow} />
      <Text style={styles.title}>{programName}</Text>
    </View>
  </ImageBackground>;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getSubProgram();
  }, [getSubProgram]);

  const renderRefreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  return subProgram && subProgram.steps ? (
    <SafeAreaView style={commonStyles.container} edges={EDGES}>
      <FlatList data={subProgram.steps} keyExtractor={item => item._id} ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => renderStepList(TESTER, route, item, index)} ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false} refreshControl={renderRefreshControl} />
    </SafeAreaView>
  )
    : <View style={commonStyles.loadingContainer}>
      <ActivityIndicator color={GREY[800]} size="small" />
    </View>;
};

export default SubProgramProfile;
