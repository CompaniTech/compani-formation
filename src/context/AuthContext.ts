import { Dispatch } from 'react';
import Authentication from '../api/authentication';
import asyncStorage from '../core/helpers/asyncStorage';
import { createDataContext } from './createDataContext';
import { navigate } from '../navigationRef';
import Users from '../api/users';
import { BEFORE_SIGNIN, SIGNIN, SIGNIN_ERROR, RESET_ERROR, SIGNOUT, RENDER } from '../core/data/constants';
import { ActionType, BoundActionsType, CreateDataContextType } from './types';
import { AuthenticationPayloadType } from '../types/AuthenticationTypes';

export interface AuthContextStateType {
  companiToken: string | null,
  loading: boolean,
  error: boolean,
  errorMessage: string,
  appIsReady: boolean
}
export interface AuthContextDispatchActionsType {
  signIn: (
    d: Dispatch<ActionType>) => ({ email, password, mobileConnectionMode }: AuthenticationPayloadType
  ) => Promise<void>,
  tryLocalSignIn: (d: Dispatch<ActionType>) => () => Promise<void>,
  signOut: (d: Dispatch<ActionType>) => (b?: boolean) => Promise<void>,
  resetError: (d: Dispatch<ActionType>) => () => void,
  refreshCompaniToken: (d: Dispatch<ActionType>) => (refreshToken: string) => Promise<void>,
}

export type AuthContextActionsType = BoundActionsType<AuthContextDispatchActionsType>;

export type AuthContextType = AuthContextActionsType & AuthContextStateType;

const authReducer = (state: AuthContextStateType, actions: ActionType): AuthContextStateType => {
  switch (actions.type) {
    case BEFORE_SIGNIN:
      return { ...state, error: false, errorMessage: '', loading: true };
    case SIGNIN:
      return { ...state, loading: false, companiToken: actions.payload };
    case SIGNIN_ERROR:
      return { ...state, loading: false, error: true, errorMessage: actions.payload };
    case RESET_ERROR:
      return { ...state, loading: false, error: false, errorMessage: '' };
    case SIGNOUT:
      return { ...state, companiToken: null, loading: false, error: false, errorMessage: '' };
    case RENDER:
      return { ...state, appIsReady: true };
    default:
      return state;
  }
};

const signIn = (dispatch: Dispatch<ActionType>) =>
  async (payload: AuthenticationPayloadType) => {
    try {
      if (!payload.email || !payload.password) return;

      dispatch({ type: BEFORE_SIGNIN });
      const authentication = await Authentication.authenticate(payload);

      await asyncStorage.setUserId(authentication.user._id);
      await asyncStorage.setRefreshToken(authentication.refreshToken);
      await asyncStorage.setCompaniToken(authentication.token, authentication.tokenExpireDate);

      dispatch({ type: SIGNIN, payload: authentication.token });
    } catch (e: any) {
      dispatch({
        type: SIGNIN_ERROR,
        payload: e.response.status === 401
          ? 'L\'e-mail et/ou le mot de passe est incorrect.'
          : 'Impossible de se connecter',
      });
    }
  };

const signOut = (dispatch: Dispatch<ActionType>) => async (removeExpoToken: boolean = false) => {
  await Authentication.logOut();

  const expoToken = await asyncStorage.getExpoToken();
  const userId = await asyncStorage.getUserId();

  if (removeExpoToken && expoToken && userId) await Users.removeExpoToken(userId, expoToken);

  await asyncStorage.removeCompaniToken();
  await asyncStorage.removeRefreshToken();
  await asyncStorage.removeUserId();
  await asyncStorage.removeExpoToken();

  dispatch({ type: SIGNOUT });
  navigate('Authentication');
};

const refreshCompaniToken = (dispatch: Dispatch<ActionType>) => async (refreshToken: string) => {
  try {
    const token = await Authentication.refreshToken({ refreshToken });

    await asyncStorage.setCompaniToken(token.token, token.tokenExpireDate);
    await asyncStorage.setRefreshToken(token.refreshToken);
    await asyncStorage.setUserId(token.user._id);

    dispatch({ type: SIGNIN, payload: token.token });
  } catch (_) {
    signOut(dispatch)();
  }
};

const localSignIn = async (dispatch: Dispatch<ActionType>) => {
  const { companiToken } = await asyncStorage.getCompaniToken();
  dispatch({ type: SIGNIN, payload: companiToken });

  navigate('LearnerCourses');
  dispatch({ type: RENDER });
};

const tryLocalSignIn = (dispatch: Dispatch<ActionType>) => async () => {
  const userId = await asyncStorage.getUserId();
  const { companiToken, companiTokenExpiryDate } = await asyncStorage.getCompaniToken();
  if (userId && asyncStorage.isTokenValid(companiToken, companiTokenExpiryDate)) return localSignIn(dispatch);

  const { refreshToken, refreshTokenExpiryDate } = await asyncStorage.getRefreshToken();
  if (!!refreshToken && asyncStorage.isTokenValid(refreshToken, refreshTokenExpiryDate)) {
    await refreshCompaniToken(dispatch)(refreshToken);
    return localSignIn(dispatch);
  }

  dispatch({ type: RENDER });
  return signOut(dispatch)();
};

const resetError = (dispatch: Dispatch<ActionType>) => () => {
  dispatch({ type: RESET_ERROR });
};

export const { Provider, Context }: CreateDataContextType = createDataContext(
  authReducer,
  { signIn, tryLocalSignIn, signOut, resetError, refreshCompaniToken },
  { companiToken: null, loading: false, error: false, errorMessage: '', appIsReady: false }
);
