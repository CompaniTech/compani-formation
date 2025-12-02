import { UserType } from './UserType';
import { StepType, ELearningStepType } from './StepTypes';
import { CompanyType } from './CompanyType';
import {
  BLENDED,
  LEARNER,
  OPERATIONS,
  PEDAGOGY,
  STRICTLY_E_LEARNING,
  TESTER,
  TRAINER,
  TUTOR,
} from '../core/data/constants';
import { AttendanceSheetType } from './AttendanceSheetTypes';

// query
export type actionQueryCourseType = typeof PEDAGOGY | typeof OPERATIONS;

// Program
export type BaseProgramType = {
  _id: string,
  name: string,
  image: { link: string },
  description?: string,
  learningGoals?: string,
  subPrograms?: SubProgramType[],
}

export type ELearningProgramType = BaseProgramType & {
  subPrograms: ELearningSubProgramType[],
}

export type ProgramType = BaseProgramType | ELearningProgramType;

// Sub-program
export type SubProgramType = {
  _id: string,
  steps: StepType[],
  isStrictlyELearning: boolean,
  courses?: CourseType[],
}

// Sub-program
export type SubProgramWithProgramType = SubProgramType & {
  program: ProgramType,
}

export type ELearningSubProgramType = SubProgramType & {
  isStrictlyELearning: true,
  courses: { _id: string, trainees: string[] }[],
  steps: ELearningStepType[],
  program?: BaseProgramType,
}

// Course
type AddressType = {
  fullAddress: string,
  street: string,
  city: string,
  zipCode: string,
  location: { coordinates: number[], type: string }
}

export type SlotType = {
  _id: string,
  startDate: Date,
  endDate: Date,
  address?: AddressType,
  meetingLink?: string,
  step: { _id: string, type: string },
  missingAttendances?: { trainee: string }[]
}

export type SlotToPlanType = {
  _id: string,
  address?: AddressType,
  meetingLink?: string,
  step: { _id: string, type: string },
}

type BaseCourseType = {
  _id: string,
  progress: { blended: number, eLearning?: number },
  subProgram: SubProgramType & { program: ProgramType },
  areLastSlotAttendancesValidated?: boolean,
  type: string,
  format: typeof STRICTLY_E_LEARNING | typeof BLENDED,
};

export type ELearningCourseType = BaseCourseType & {
  subProgram: { isStrictlyELearning: true },
  trainees?: string[],
};

export type TraineeType = {
  _id: string,
  identity: { lastname: string, firstname: string },
  local: { email: string },
  picture: { link: '' },
  firstMobileConnectionDate: string,
}

export type InterlocutorType = {
  _id: string,
  identity: { lastname: string, firstname: string },
  picture: { link: '' },
};

export type TrainerType = InterlocutorType & { biography: '' };

export type TutorType = InterlocutorType;

export type BlendedCourseType = BaseCourseType & {
  subProgram: { isStrictlyELearning: false },
  archivedAt: Date,
  slots: SlotType[],
  slotsToPlan: SlotToPlanType[],
  trainers: TrainerType[],
  contact: UserType,
  companyRepresentative: UserType,
  misc: string,
  trainees?: TraineeType[],
  companies?: CompanyType[],
  tutors?: TutorType[],
  attendanceSheets?: AttendanceSheetType[],
  gSheetId?: string
}

export type CourseModeType = typeof LEARNER | typeof TESTER | typeof TRAINER | typeof TUTOR;

export type CourseType = ELearningCourseType | BlendedCourseType;
