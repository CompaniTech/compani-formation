// Actions types
export const SET_IS_COURSE = 'SET_IS_COURSE';
export const RESET_COURSE_REDUCER = 'RESET_COURSE_REDUCER';

export type SetIsCourseType = {
  type: typeof SET_IS_COURSE,
  value: boolean,
}

export type ResetCourseReducer = {
  type: typeof RESET_COURSE_REDUCER,
}

export type CourseActionWithoutPayloadType = ResetCourseReducer | SetIsCourseType;

export type CourseStateType = {
  isCourse: boolean,
}
