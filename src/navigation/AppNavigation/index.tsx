// @ts-nocheck

import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContextType, Context as AuthContext } from '../../context/AuthContext';
import { navigationRef } from '../../navigationRef';
import Home from '../../navigation/Home/index';
import Authentication from '../../screens/Authentication';
import EmailForm from '../../screens/EmailForm';
import LoginCodeForm from '../../screens/LoginCodeForm';
import CreateAccount from '../../screens/CreateAccount';
import CreateAttendanceSheet from '../../screens/courses/profile/CreateAttendanceSheet';
import UpdateAttendanceSheet from '../../screens/courses/profile/UpdateAttendanceSheet';
import HandleAttendanceSheetNotification from '../../screens/courses/profile/HandleAttendanceSheetNotification';
import BlendedAbout from '../../screens/explore/BlendedAbout';
import ElearningAbout from '../../screens/explore/ELearningAbout';
import LearnerCourseProfile from '../../screens/courses/profile/LearnerCourseProfile';
import TrainerCourseProfile from '../../screens/courses/profile/TrainerCourseProfile';
import TraineeFollowUp from '../../screens/courses/TraineeFollowUp';
import AdminCourseProfile from '../../screens/courses/profile/AdminCourseProfile';
import SubProgramProfile from '../../screens/courses/profile/SubProgramProfile';
import ActivityCardContainer from '../../screens/courses/ActivityCardContainer';
import QuestionnaireCardContainer from '../../screens/courses/QuestionnaireCardContainer';
import ProfileEdition from '../../screens/profile/ProfileEdition';
import PasswordEdition from '../../screens/profile/PasswordEdition';
import PasswordReset from '../../screens/PasswordReset';
import { RootStackParamList } from '../../types/NavigationType';
import { tabsNames } from '../../core/data/tabs';

const MainStack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const { companiToken }: AuthContextType = useContext(AuthContext);

  const authScreens = { Authentication, EmailForm, CreateAccount, PasswordReset, LoginCodeForm };

  const Profile = { ProfileEdition, PasswordEdition };
  const Courses = { LearnerCourseProfile, SubProgramProfile, TrainerCourseProfile };
  const userScreens = {
    Home,
    ActivityCardContainer,
    QuestionnaireCardContainer,
    BlendedAbout,
    ElearningAbout,
    AdminCourseProfile,
    TraineeFollowUp,
    CreateAttendanceSheet,
    UpdateAttendanceSheet,
    HandleAttendanceSheetNotification,
    ...Profile,
    ...Courses,
  };
  const undismissableScreens = ['ActivityCardContainer', 'QuestionnaireCardContainer'];

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }} presentation='card'>
        {Object.entries(companiToken ? userScreens : authScreens)
          .map(([name, component]) => (
            <MainStack.Screen key={name} name={name as keyof RootStackParamList} component={component}
              options={
                undismissableScreens.includes(name)
                  ? { gestureEnabled: false, title: tabsNames[name] }
                  : { title: tabsNames[name] }
              } />
          ))}
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
