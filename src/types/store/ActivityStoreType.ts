import { ActivityType } from '../ActivityType';
import { ActivityHistoryType } from '../ActivityHistoryType';

// Actions types
export const SET_ACTIVITY = 'SET_ACTIVITY';
export const SET_EXIT_CONFIRMATION_MODAL = 'SET_EXIT_CONFIRMATION_MODAL';
export const RESET_ACTIVITY_REDUCER = 'RESET_ACTIVITY_REDUCER';
export const INC_GOOD_ANSWERS_COUNT = 'INC_GOOD_ANSWERS_COUNT';
export const SET_ACTIVITY_HISTORIES = 'SET_ACTIVITY_HISTORIES';

export interface SetActivityType {
  type: typeof SET_ACTIVITY,
  payload: ActivityType,
}
export interface SetExitConfirmationModalType {
  type: typeof SET_EXIT_CONFIRMATION_MODAL,
  payload: boolean,
}

export interface SetActivityHistories {
  type: typeof SET_ACTIVITY_HISTORIES,
  payload: Array<ActivityHistoryType>,
}

export interface ResetActivityReducer {
  type: typeof RESET_ACTIVITY_REDUCER,
}

export interface IncGoodAnswersCountType {
  type: typeof INC_GOOD_ANSWERS_COUNT,
}

export type ActivityActionType =
SetActivityType |
SetExitConfirmationModalType |
SetActivityHistories;

export type ActivityActionWithoutPayloadType = ResetActivityReducer | IncGoodAnswersCountType;

export interface ActivityStateType {
  activity: ActivityType | null,
  exitConfirmationModal: boolean,
  score: number
  activityHistories: Array<ActivityHistoryType>
}
