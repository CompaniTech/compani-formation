import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pick } from 'lodash';
import { UserType } from '../../types/UserType';
import { resetAllReducers } from '../actions';

type MainStateType = {
  loggedUser: UserType | null,
  statusBarVisible: boolean,
}

const initialState: MainStateType = { loggedUser: null, statusBarVisible: true };

const setUser = (state: MainStateType, action: PayloadAction<UserType>) => ({
  ...state,
  loggedUser: pick(action.payload, [
    '_id',
    'identity.firstname',
    'identity.lastname',
    'local.email',
    'picture.link',
    'company.name',
    'contact.phone',
    'contact.countryCode',
    'role',
    'companyLinkRequest',
  ]) as UserType,
});

const setStatusBar = (state: MainStateType, action: PayloadAction<boolean>) => (
  { ...state, statusBarVisible: action.payload }
);

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setLoggedUser: setUser,
    setStatusBarVisible: setStatusBar,
  },
  extraReducers: (builder) => { builder.addCase(resetAllReducers, () => initialState); },
});

export const { setLoggedUser, setStatusBarVisible } = mainSlice.actions;

export default mainSlice.reducer;
