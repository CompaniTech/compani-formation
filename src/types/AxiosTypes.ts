import { ActivityWithCardsType } from './ActivityTypes';
import { CompanyType } from './CompanyType';
import { CourseType, ProgramType, SubProgramType } from './CourseTypes';
import { QuestionnaireType, QuestionnaireWithCardsType } from './QuestionnaireType';
import { UserType } from './UserType';

// ACTIVITY
export type ActivityResponseType = { message: string, data: { activity: ActivityWithCardsType } };

// AUTHENTICATION
export type AuthenticationType = {
  token: string,
  tokenExpireDate: Date,
  refreshToken: string,
  user: { _id: string },
};
export type ForgotPasswordType = { phone: string } | void;
export type PasswordTokenType = { token: string, user: { _id: string, email: string } };
export type AuthenticationResponseType = { message: string, data: AuthenticationType }
export type ForgotPasswordResponseType = { message: string, data: { mailInfo: ForgotPasswordType } }
export type PasswordTokenResponseType = { message: string, data: PasswordTokenType }

// COMPANY
export type CompanyListResponseType = { message: string, data: { companies: CompanyType[] } }

// COURSE
export type CourseListResponseType = { message: string, data: { courses: CourseType[] } }
export type CourseResponseType = { message: string, data: { course: CourseType } }
export type PdfResponseType = { data: string }

// PROGRAM
export type ElearningProgramType = ProgramType & { categories: { name: string }[] };
export type ProgramListResponseType = { message: string, data: { programs: ElearningProgramType[] } }

// QUESTIONNAIRE
export type QuestionnaireListResponseType = { message: string, data: { questionnaires: QuestionnaireType[] } }
export type QuestionnaireResponseType = { message: string, data: { questionnaire: QuestionnaireWithCardsType } }

// SUBPROGRAM
export type SubProgramListResponseType = { message: string, data: { subPrograms: SubProgramType[] } }
export type SubProgramResponseType = { message: string, data: { subProgram: SubProgramType } }

// USER
export type ExistsType = { exists: boolean, user: { _id?: string, company?: string, role?: string } };
export type UserCreationType = {
  identity: { lastname: UserType['identity']['lastname'], firstname?: UserType['identity']['firstname'] }
  contact: UserType['contact'],
  local: UserType['local'] & { password: string },
};
export type UserResponseType = { message: string, data: { user: UserType } }
export type ExistsResponseType = { message: string, data: { exists: ExistsType } }

// VERSION
export type ShouldUpdateType = { mustUpdate: boolean };
export type ShouldUpdateResponseType = { message: string, data: ShouldUpdateType }
