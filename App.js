import React, { useState, useEffect, useContext } from 'react';
import { StatusBar, View, StyleSheet, AppState, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthenticationScreen from './src/screens/Authentication';
import ProgramListScreen from './src/screens/ProgramList';
import CourseListScreen from './src/screens/CourseList';
import { Provider as AuthProvider, Context as AuthContext } from './src/context/AuthContext';
import { navigationRef } from './src/navigationRef';
import variables from './src/styles/variables';
import getEnvVars from './environment';
import Version from './src/api/version';
import NiModal from './src/components/Modal';

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ProgramList" component={ProgramListScreen} options={{ tabBarLabel: 'Catalogue!' }} />
      <Tab.Screen name="CourseList" component={CourseListScreen} options={{ tabBarLabel: 'Mes formations' }} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function AppContainer () {
  const { tryLocalSignIn, token } = useContext(AuthContext);
  useEffect(() => { tryLocalSignIn(); }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {token === null
        ? <Stack.Screen name="Authentication" component={AuthenticationScreen} />
        : <Stack.Screen name="Home" component={Home} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  const appUrl = Platform.OS == 'ios'
    ? 'https://apps.apple.com/app/id1447513534'
    : 'market://details?id=com.alenvi.compani';
  const [modalOpened, setModalOpened] = useState(false);

  const checkUpdate = async (nextState) => {
    if (nextState === 'active') {
      const envVars = getEnvVars();
      const { mustUpdate } = await Version.checkUpdate({ apiVersion: envVars.apiVersion });
      setModalOpened(mustUpdate);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', checkUpdate);

    return () => {
      AppState.removeEventListener('change', checkUpdate);
    };
  });

  checkUpdate('active');

  return (
    <>
      <NiModal
        visible={modalOpened}
        title="Nouvelle version de l'app disponible !"
        contentText="Merci de mettre votre application à jour pour pouvoir continuer d'utiliser l'application :)"
        buttonCaption="Mettre à jour"
        onPress={() => { Linking.openURL(appUrl); }}
        onRequestClose={() => setModalOpened(false)}
      />
      <AuthProvider>
        <View style={[styles.statusBar]}>
          <StatusBar translucent barStyle="dark-content" backgroundColor={variables.NEUTRAL_BACKGROUND_COLOR} />
        </View>
        <AppContainer />
      </AuthProvider>
    </>
  );
};

export default App;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: variables.NEUTRAL_BACKGROUND_COLOR,
    height: STATUSBAR_HEIGHT,
  },
});
