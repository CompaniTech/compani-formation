import { BlendedCourseType, CourseModeType, ELearningProgramType } from './CourseTypes';

export type RootStackParamList = {
  Authentication: undefined;
  EmailForm: { firstConnection: Boolean } | undefined;
  CreateAccount: { email: string };
  PasswordReset: { userId: string, email: string, token: string, mobileConnectionMode: string }
  ActivityCardContainer: { activityId: string, profileId: string, mode: CourseModeType };
  QuestionnaireCardContainer: { profileId: string };
  BlendedAbout: { course: BlendedCourseType, mode: CourseModeType }
  ElearningAbout: { program: ELearningProgramType }
  AdminCourseProfile: { courseId: string }
  CreateAttendanceSheet: { isSingle: boolean };
  UpdateAttendanceSheet: { attendanceSheetId: string, trainerName: string },
  ProfileEdition: undefined;
  PasswordEdition: { userId: string };
  ImagePickerManager: undefined;
  LearnerCourseProfile: {
    courseId: string,
    endedActivity?: string | null,
    endedQuestionnaire?: string | null,
    mode?: CourseModeType,
  };
  TraineeFollowUp: { courseId: string, trainee: string };
  TrainerCourseProfile: { courseId: string };
  SubProgramProfile: { subProgramId: string };
  CourseProfileHeader: undefined,
  LoginCodeForm: undefined,
  HandleAttendanceSheetNotification: { attendanceSheetId: string, courseId: string }
}

export type RootBottomTabParamList = {
  Catalog: undefined;
  LearnerCourses: undefined;
  TrainerCourses: undefined;
  Profile: undefined;
}

export type RootCreateAccountParamList = {
  [key: `create-account-screen-${number}`]: undefined;
}

export type RootCreateAttendanceSheetParamList = {
  'attendance-sheet-data-selection': undefined;
  'upload-method-selection': undefined;
  'slots-data-selection': undefined;
  'attendance-signature': undefined;
  'attendance-summary': undefined;
  'end-screen': undefined;
}

export type RootUpdateAttendanceSheetParamList = {
  'slots-data-selection': undefined;
  'attendance-signature': undefined;
  'attendance-summary': undefined;
  'end-screen': undefined;
}

export type RootCardParamList = {
  [key: `card-${number}`]: undefined;
  'startCard': undefined;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface RootParamList extends RootBottomTabParamList {}
    interface RootParamList extends RootCreateAccountParamList {}
    interface RootParamList extends RootCreateAttendanceSheetParamList {}
    interface RootParamList extends RootCardParamList {}
  }
}
