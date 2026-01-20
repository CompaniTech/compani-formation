// @ts-nocheck

import { useEffect, useContext, useState, useRef, useCallback } from 'react';
import { StatusBar, View, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import get from 'lodash/get';
import { AxiosRequestConfig, AxiosError } from 'axios';
import AppNavigation from '../navigation/AppNavigation';
import { AuthContextType, Context as AuthContext } from '../context/AuthContext';
import { useGetStatusBarVisible, useSetLoggedUser } from '../store/main/hooks';
import axiosLogged from '../api/axios/logged';
import axiosNotLogged from '../api/axios/notLogged';
import Users from '../api/users';
import Version from '../api/version';
import asyncStorage from '../core/helpers/asyncStorage';
import {
  registerForPushNotificationsAsync,
  handleNotificationResponse,
  handleExpoToken,
} from '../core/helpers/notifications';
import CompaniDate from '../core/helpers/dates/companiDates';
import { ACTIVE_STATE, IS_WEB } from '../core/data/constants';
import UpdateAppModal from '../components/UpdateAppModal';
import MaintenanceModal from '../components/MaintenanceModal';
import ToastMessage from '../components/ToastMessage';
import { WHITE } from '../styles/colors';
import styles from './styles';

const isForeground = () => AppState.currentState === ACTIVE_STATE;

type AppContainerProps = {
  onLayout: () => void;
};

const getAxiosLoggedConfig = (config: AxiosRequestConfig, token: string) => {
  const axiosLoggedConfig = { ...config };
  if (axiosLoggedConfig.headers) axiosLoggedConfig.headers.set({ 'x-access-token': token });

  return axiosLoggedConfig;
};

const AppContainer = ({ onLayout }: AppContainerProps) => {
  const {
    tryLocalSignIn,
    companiToken,
    appIsReady,
    signOut,
    refreshCompaniToken,
  }: AuthContextType = useContext(AuthContext);

  const setLoggedUser = useSetLoggedUser();
  const statusBarVisible = useGetStatusBarVisible();

  const [updateModaleVisible, setUpdateModaleVisible] = useState<boolean>(false);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState<boolean>(false);
  const axiosLoggedRequestInterceptorId = useRef<number | null>(null);
  const axiosLoggedResponseInterceptorId = useRef<number | null>(null);
  const axiosNotLoggedResponseInterceptorId = useRef<number | null>(null);
  const didRegisterPush = useRef(false);
  const lastCheckRef = useRef(0);
  const [triggerToastMessage, setTriggerToastMessage] = useState<boolean>(false);

  useEffect(() => {
    if (!IS_WEB) {
      if (companiToken && !didRegisterPush.current) {
        didRegisterPush.current = true;
        registerForPushNotificationsAsync().then(async (data) => {
          await handleExpoToken(data);
        });
      } else if (!companiToken) didRegisterPush.current = false;
    }
  }, [companiToken]);

  useEffect(() => {
    let subscription;
    if (!IS_WEB) {
      subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const isValidNotification = get(response, 'notification.request.content.data') &&
          get(response, 'actionIdentifier') === Notifications.DEFAULT_ACTION_IDENTIFIER;
        if (isValidNotification) handleNotificationResponse(response);
      });
    }
    return () => (subscription ? subscription.remove() : null);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { tryLocalSignIn(); }, []);

  const initializeAxiosNotLogged = () => {
    if (axiosNotLoggedResponseInterceptorId.current !== null) {
      axiosNotLogged.interceptors.response.eject(axiosNotLoggedResponseInterceptorId.current);
    }

    axiosNotLoggedResponseInterceptorId.current = axiosNotLogged.interceptors.response.use(
      (response) => {
        setMaintenanceModalVisible(false);
        return response;
      },
      async (error: AxiosError) => {
        if (error?.response?.status === 502 || error?.response?.status === 503) setMaintenanceModalVisible(true);
        return Promise.reject(error);
      }
    );
  };

  const handleUnauthorizedRequest = useCallback(async (error: AxiosError) => {
    const storedTokens = await asyncStorage.getCompaniToken();
    if (asyncStorage.isTokenValid(storedTokens.companiToken, storedTokens.companiTokenExpiryDate)) {
      await signOut();
      return Promise.reject(error);
    } // handle invalid refreshToken reception from api which trigger infinite 401 calls

    await asyncStorage.removeCompaniToken();
    const { refreshToken } = await asyncStorage.getRefreshToken();

    if (refreshToken) {
      await refreshCompaniToken(refreshToken);

      const { companiToken: newCompaniToken, companiTokenExpiryDate } = await asyncStorage.getCompaniToken();
      if (asyncStorage.isTokenValid(newCompaniToken, companiTokenExpiryDate)) {
        const config = { ...error.config };
        if (config.headers) config.headers.set({ 'x-access-token': newCompaniToken || '' });

        return axiosLogged.request(config);
      }
    }

    if (isForeground()) setTimeout(() => signOut(), 0);
    return Promise.reject(error.response);
  }, [signOut, refreshCompaniToken]);

  const initializeAxiosLogged = useCallback((token: string) => {
    if (axiosLoggedRequestInterceptorId.current !== null) {
      axiosLogged.interceptors.request.eject(axiosLoggedRequestInterceptorId.current);
    }

    axiosLoggedRequestInterceptorId.current = axiosLogged.interceptors
      .request
      .use(
        async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => getAxiosLoggedConfig(config, token),
        err => Promise.reject(err)
      );

    if (axiosLoggedResponseInterceptorId.current !== null) {
      axiosLogged.interceptors.response.eject(axiosLoggedResponseInterceptorId.current);
    }

    axiosLoggedResponseInterceptorId.current = axiosLogged.interceptors
      .response
      .use(
        response => response,
        async (error: AxiosError) => {
          if ([400, 401].includes(error?.response?.status)) setTriggerToastMessage(true);
          if (error?.response?.status === 401) return handleUnauthorizedRequest(error);
          if (error?.response?.status === 502 || error?.response?.status === 503) setMaintenanceModalVisible(true);
          return Promise.reject(error);
        }
      );
  }, [handleUnauthorizedRequest]);

  useEffect(() => {
    // If companiToken is null (at logout), reset axioslogged
    initializeAxiosLogged(companiToken);
  }, [companiToken, initializeAxiosLogged]);

  useEffect(() => {
    async function setUser() {
      try {
        const userId = await asyncStorage.getUserId();

        if (!userId) signOut();
        else {
          const user = await Users.getById(userId);
          setLoggedUser(user);
        }
      } catch (e: any) {
        console.error(e);
      }
    }

    if (companiToken) setUser();
  }, [companiToken, setLoggedUser, signOut]);

  const shouldUpdate = useCallback(async (nextState) => {
    if (nextState !== ACTIVE_STATE || !isForeground()) return;

    const now = CompaniDate().toMillis();
    if (now - lastCheckRef.current < 3000) return;
    lastCheckRef.current = now;

    try {
      const { mustUpdate } = await Version.shouldUpdate();
      setUpdateModaleVisible(mustUpdate);
    } catch (error) {
      console.error(error);
    }
  }, [setUpdateModaleVisible]);

  useEffect(() => {
    initializeAxiosNotLogged();
    shouldUpdate(ACTIVE_STATE);
    const { remove } = AppState.addEventListener('change', shouldUpdate);

    return () => { remove(); };
  }, [shouldUpdate]);

  if (!appIsReady) return null;

  const style = styles(statusBarVisible);

  if (maintenanceModalVisible) return <MaintenanceModal />;
  if (updateModaleVisible) return <UpdateAppModal />;

  return (
    <>
      <View style={style.statusBar}>
        <StatusBar hidden={!statusBarVisible} translucent barStyle="dark-content" backgroundColor={WHITE} />
      </View>
      <SafeAreaProvider onLayout={onLayout}>
        <AppNavigation />
        {triggerToastMessage && <ToastMessage onFinish={(finished: boolean) => setTriggerToastMessage(!finished)}
          message={'Vous n\'êtes pas connecté'} />}
      </SafeAreaProvider>
    </>
  );
};

export default AppContainer;
