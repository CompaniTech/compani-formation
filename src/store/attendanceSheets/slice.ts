import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAllReducers } from '../actions';
import { BlendedCourseType, SlotType } from '../../types/CourseTypes';

export type DataOptionsType = { value: string; label: string, disabled?: boolean }

export type AttendanceSheetStateType = {
  course: BlendedCourseType | null,
  missingAttendanceSheets: DataOptionsType[],
  groupedSlotsToBeSigned: Record<string, SlotType[]>,
  shouldRefreshSheets: boolean,
}
const initialState: AttendanceSheetStateType = {
  course: null,
  missingAttendanceSheets: [],
  groupedSlotsToBeSigned: {},
  shouldRefreshSheets: false,
};

const resetReducer = () => initialState;

const resetCourse = (state: AttendanceSheetStateType) => ({
  ...state,
  course: null,
  missingAttendanceSheets: [],
  groupedSlotsToBeSigned: {},
  // Keep shouldRefreshSheets as is - don't reset it
});

const setBlendedCourse = (state: AttendanceSheetStateType, action: PayloadAction<BlendedCourseType | null>) => (
  { ...state, course: action.payload }
);

const setMissingAttendanceSheetList =
  (state: AttendanceSheetStateType, action: PayloadAction<DataOptionsType[]>) => (
    { ...state, missingAttendanceSheets: action.payload }
  );

const setGroupedSlotsToBeSignedList =
  (state: AttendanceSheetStateType, action: PayloadAction<Record<string, SlotType[]>>) => (
    { ...state, groupedSlotsToBeSigned: action.payload }
  );

const setShouldRefreshAttendanceSheets =
  (state: AttendanceSheetStateType, action: PayloadAction<boolean>) => (
    { ...state, shouldRefreshSheets: action.payload }
  );

const attendanceSheetSlice = createSlice({
  name: 'attendanceSheets',
  initialState,
  reducers: {
    setCourse: setBlendedCourse,
    setMissingAttendanceSheets: setMissingAttendanceSheetList,
    setGroupedSlotsToBeSigned: setGroupedSlotsToBeSignedList,
    setShouldRefreshSheets: setShouldRefreshAttendanceSheets,
    resetAttendanceSheetReducer: resetReducer,
    resetCourseData: resetCourse,
  },
  extraReducers: (builder) => { builder.addCase(resetAllReducers, () => initialState); },
});

export const {
  setCourse,
  setMissingAttendanceSheets,
  setGroupedSlotsToBeSigned,
  setShouldRefreshSheets,
  resetAttendanceSheetReducer,
  resetCourseData,
} = attendanceSheetSlice.actions;

export default attendanceSheetSlice.reducer;
