import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAllReducers } from '../actions';
import { BlendedCourseType, SlotType } from '../../types/CourseTypes';

export type DataOptionsType = { value: string; label: string, disabled?: boolean }

export type AttendanceSheetStateType = {
  course: BlendedCourseType | null,
  missingAttendanceSheets: DataOptionsType[],
  groupedSlotsToBeSigned: Record<string, SlotType[]>,
}
const initialState: AttendanceSheetStateType = {
  course: null,
  missingAttendanceSheets: [],
  groupedSlotsToBeSigned: {},
};

const resetReducer = () => initialState;

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

const attendanceSheetSlice = createSlice({
  name: 'attendanceSheets',
  initialState,
  reducers: {
    setCourse: setBlendedCourse,
    setMissingAttendanceSheets: setMissingAttendanceSheetList,
    setGroupedSlotsToBeSigned: setGroupedSlotsToBeSignedList,
    resetAttendanceSheetReducer: resetReducer,
  },
  extraReducers: (builder) => { builder.addCase(resetAllReducers, () => initialState); },
});

export const {
  setCourse,
  setMissingAttendanceSheets,
  setGroupedSlotsToBeSigned,
  resetAttendanceSheetReducer,
} = attendanceSheetSlice.actions;

export default attendanceSheetSlice.reducer;
