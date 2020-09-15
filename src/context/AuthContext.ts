import Users from '../api/authentication';
import asyncStorage from '../core/helpers/asyncStorage';
import createDataContext from './createDataContext';
import { navigate } from '../navigationRef';

export interface StateType {
  alenviToken: string | null,
  loading: boolean,
  error: boolean,
  errorMessage: string,
  appIsReady: boolean
}

const authReducer = (state: StateType, actions): StateType => {
  switch (actions.type) {
    case 'beforeSignin':
      return { ...state, error: false, errorMessage: '', loading: true };
    case 'signin':
      return { ...state, loading: false, alenviToken: actions.payload };
    case 'signinError':
      return { ...state, loading: false, error: true, errorMessage: actions.payload };
    case 'resetError':
      return { ...state, loading: false, error: false, errorMessage: '' };
    case 'signout':
      return { ...state, alenviToken: null, loading: false, error: false, errorMessage: '' };
    case 'render':
      return { ...state, appIsReady: true };
    default:
      return state;
  }
};

const signIn = dispatch => async ({ email, password }) => {
  try {
    if (!email || !password) return;

    dispatch({ type: 'beforeSignin' });
    const authentication = await Users.authenticate({ email, password });

    await asyncStorage.setAlenviToken(authentication.token);
    await asyncStorage.setRefreshToken(authentication.refreshToken);
    await asyncStorage.setUserId(authentication.user._id);

    dispatch({ type: 'signin', payload: authentication.token });
    navigate('Home', { screen: 'Courses', params: { screen: 'CourseList' } });
  } catch (e) {
    dispatch({
      type: 'signinError',
      payload: e.response.status === 401
        ? 'L\'email et/ou le mot de passe est incorrect.'
        : 'Impossible de se connecter',
    });
  }
};

const signOut = dispatch => async () => {
  await asyncStorage.removeAlenviToken();
  await asyncStorage.removeRefreshToken();

  dispatch({ type: 'signout' });
  navigate('Authentication');
};

const refreshAlenviToken = async (refreshToken, dispatch) => {
  try {
    const token = await Users.refreshToken({ refreshToken });

    await asyncStorage.setAlenviToken(token.token);
    await asyncStorage.setRefreshToken(token.refreshToken);
    await asyncStorage.setUserId(token.user._id);
  } catch (e) {
    signOut(dispatch)();
  }
};

const localSignIn = async (dispatch) => {
  const { alenviToken } = await asyncStorage.getAlenviToken();
  dispatch({ type: 'signin', payload: alenviToken });

  navigate('Home', { screen: 'Courses', params: { screen: 'CourseList' } });
  dispatch({ type: 'render' });
};

const tryLocalSignIn = dispatch => async () => {
  const userId = await asyncStorage.getUserId();
  const { alenviToken, alenviTokenExpiryDate } = await asyncStorage.getAlenviToken();
  if (userId && asyncStorage.isTokenValid(alenviToken, alenviTokenExpiryDate)) return localSignIn(dispatch);

  const { refreshToken, refreshTokenExpiryDate } = await asyncStorage.getRefreshToken();
  if (asyncStorage.isTokenValid(refreshToken, refreshTokenExpiryDate)) {
    await refreshAlenviToken(refreshToken, dispatch);
    return localSignIn(dispatch);
  }

  dispatch({ type: 'render' });
  return signOut(dispatch)();
};

const resetError = dispatch => () => {
  dispatch({ type: 'resetError' });
};

export const { Provider, Context }: any = createDataContext(
  authReducer,
  { signIn, tryLocalSignIn, signOut, resetError },
  { alenviToken: null, loading: false, error: false, errorMessage: '', appIsReady: false }
);
