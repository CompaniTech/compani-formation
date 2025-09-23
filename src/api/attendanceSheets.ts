import { AxiosResponse, AxiosHeaders } from 'axios';
import axiosLogged from './axios/logged';
import Environment from '../../environment';
import { AttendanceSheetListResponseType } from '../types/AxiosTypes';
import { AttendanceSheetType } from '../types/AttendanceSheetTypes';
import { FormDataType } from '../types/FileType';

export default {
  getAttendanceSheetList: async (params: { course: string }): Promise<AttendanceSheetType[]> => {
    const baseURL = await Environment.getBaseUrl();
    const response: AxiosResponse<AttendanceSheetListResponseType> = await axiosLogged.get(
      `${baseURL}/attendancesheets`,
      { params }
    );

    return response.data.data.attendanceSheets;
  },
  upload: async (data: FormDataType): Promise<void> => {
    const baseURL = await Environment.getBaseUrl();
    const headers = new AxiosHeaders({ 'Content-Type': 'multipart/form-data' });
    await axiosLogged.post(`${baseURL}/attendancesheets`, data, { headers });
  },
  sign: async (attendanceSheetId: string, data: FormDataType): Promise<void> => {
    const baseURL = await Environment.getBaseUrl();
    const headers = new AxiosHeaders({ 'Content-Type': 'multipart/form-data' });
    await axiosLogged.put(`${baseURL}/attendancesheets/${attendanceSheetId}/signature`, data, { headers });
  },
  delete: async (attendanceSheetId: string, params: { shouldDeleteAttendances: boolean }): Promise<void> => {
    const baseURL = await Environment.getBaseUrl();
    await axiosLogged.delete(`${baseURL}/attendancesheets/${attendanceSheetId}`, { params });
  },
};
