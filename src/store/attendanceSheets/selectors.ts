import { StateType } from '../store';

export const getCourse = (state: StateType) => state.attendanceSheets.course;

export const getMissingAttendanceSheets = (state: StateType) => state.attendanceSheets.missingAttendanceSheets;

export const getGroupedSlotsToBeSigned = (state: StateType) => state.attendanceSheets.groupedSlotsToBeSigned;

export const getShouldRefreshSheets = (state: StateType) => state.attendanceSheets.shouldRefreshSheets;
