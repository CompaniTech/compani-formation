import { AxiosHeaders, AxiosResponse } from 'axios';
import axiosLogged from './axios/logged';
import Environment from '../../environment';
import { CourseType, actionQueryCourseType } from '../types/CourseTypes';
import {
  BlendedCourseListResponseType,
  CourseResponseType,
  PdfResponseType,
  PedagogyCourseListResponseType,
  OperationsCourseListResponseType,
} from '../types/AxiosTypes';
import { MOBILE, OPERATIONS, PDF } from '../core/data/constants';

type GetCourseListType = {
  action: actionQueryCourseType,
  format?: string,
  trainer?: string
}

export default {
  getCourseList:
    async (params: GetCourseListType): Promise<OperationsCourseListResponseType | PedagogyCourseListResponseType> => {
      const baseURL = await Environment.getBaseUrl();
      const response: AxiosResponse<BlendedCourseListResponseType> = await axiosLogged.get(
        `${baseURL}/courses`,
        { params: { ...params, origin: MOBILE } }
      );

      return response.data.data.courses;
    },
  getCourse: async (courseId: string, action: actionQueryCourseType): Promise<CourseType> => {
    const baseURL = await Environment.getBaseUrl();
    const response: AxiosResponse<CourseResponseType> = await axiosLogged.get(
      `${baseURL}/courses/${courseId}`,
      { params: { action, ...(action === OPERATIONS && { origin: MOBILE }) } }
    );

    return response.data.data.course;
  },
  registerToELearningCourse: async (courseId: string): Promise<void> => {
    const baseURL = await Environment.getBaseUrl();
    await axiosLogged.post(`${baseURL}/courses/${courseId}/register-e-learning`);
  },
  downloadCertificate: async (courseId: string) : Promise<string> => {
    const baseURL = await Environment.getBaseUrl();
    const headers = new AxiosHeaders({ Accept: 'application/pdf' });
    const response: PdfResponseType = await axiosLogged.get(
      `${baseURL}/courses/${courseId}/completion-certificates`,
      { params: { format: PDF }, responseType: 'arraybuffer', headers }
    );

    return response.data;
  },
};
