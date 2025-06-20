import { Dispatch, ContextType, JSX } from 'react';

export interface ActionType {
  type: string;
  payload?: any;
}

export type BoundActionsType<T> = {
  [K in keyof T]: T[K] extends (d: Dispatch<ActionType>) => infer R ? R : never
}

export interface CreateDataContextType {
  Context: ContextType<any>,
  Provider: (children: { children: JSX.Element }) => JSX.Element
}
