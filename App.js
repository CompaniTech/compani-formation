import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import AuthenticationScreen from './src/screens/AuthenticationScreen';
import ProgramListScreen from './src/screens/ProgramListScreen';
import CourseListScreen from './src/screens/CourseListScreen';
import CourseProfileScreen from './src/screens/CourseProfileScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';

const switchNavigator = createSwitchNavigator({
  authenticationFlow: createStackNavigator({
    Authentication: AuthenticationScreen,
  }),
  mainFlow: createBottomTabNavigator({
    courseflow: createStackNavigator({
      CourseList: CourseListScreen,
      CourseProfile: CourseProfileScreen,
    }),
    ProgramList: ProgramListScreen,
  })
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
