// @ts-nocheck

import { useReducer, createContext } from 'react';
import { AuthContextStateType, AuthContextDispatchActionsType } from './AuthContext';
import { ActionType, CreateDataContextType } from './types';

type ContextStateType = AuthContextStateType
type ContextDispatchActionsType = AuthContextDispatchActionsType;

export const createDataContext = (
  reducer: (state: ContextStateType, action: ActionType) => ContextStateType,
  actions: ContextDispatchActionsType,
  defaultValue: ContextStateType
): CreateDataContextType => {
  const Context = createContext(defaultValue);

  const Provider = ({ children }: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = {};
    for (const key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider value={{ ...state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
