// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Provider as ReduxProvider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import { Provider as AuthProvider } from '../context/AuthContext';
import AppContainer from '../AppContainer';
import store from '../store/store';
import Environment from '../../environment';
import { initializeAssets } from '../core/helpers/assets';

Sentry.init({ dsn: Environment.getSentryKey(), debug: false });

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: true }),
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeAssets();
      } catch (e) {
        console.error(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(
    async () => {
      if (appReady) await SplashScreen.hideAsync();
    },
    [appReady]
  );

  if (!appReady) return null;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  return (
    <AuthProvider>
      <ReduxProvider store={store}>
        <AppContainer onLayout={onLayoutRootView} />
      </ReduxProvider>
    </AuthProvider>
  );
};

export default Sentry.wrap(App);
