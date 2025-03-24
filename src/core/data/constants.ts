import { Platform } from 'react-native';
import CompaniDate, { CompaniDateType } from '../helpers/dates/companiDates';

export const APP_NAME = 'formation';
export const LOCAL = 'local';
export const DEVELOPMENT = 'development';
export const STAGING = 'staging';
export const PRODUCTION = 'production';
export const IS_IOS = Platform.OS === 'ios';
export const IS_WEB = Platform.OS === 'web';

export const TODAY : CompaniDateType = CompaniDate();

export const LONG_FIRSTNAME_LONG_LASTNAME = 'FL';
export const SHORT_FIRSTNAME_LONG_LASTNAME = 'fL';

// COURSES
export const STRICTLY_E_LEARNING = 'strictly_e_learning';
export const BLENDED = 'blended';
export const OPERATIONS = 'operations';
export const PEDAGOGY = 'pedagogy';
export const INTRA = 'intra';
export const INTER_B2B = 'inter_b2b';
export const INTRA_HOLDING = 'intra_holding';
export const SINGLE = 'single';

// STEPS
export const ON_SITE = 'on_site';
export const REMOTE = 'remote';
export const E_LEARNING = 'e_learning';
export const STEP_TYPE_OPTIONS = {
  [ON_SITE]: 'Présentiel',
  [REMOTE]: 'Distanciel',
  [E_LEARNING]: 'eLearning',
};

// ICON FAMILY
export const FEATHER = 'Feather';
export const IONICONS = 'Ionicons';

// ARROWS DIRECTION
export const LEFT = 'left';
export const RIGHT = 'right';

// ACTIVITIES
export const LESSON = 'lesson';
export const QUIZ = 'quiz';
export const SHARING_EXPERIENCE = 'sharing_experience';
export const VIDEO = 'video';

export const TRANSITION = 'transition';
export const TITLE_TEXT_MEDIA = 'title_text_media';
export const TITLE_TEXT = 'title_text';
export const TEXT_MEDIA = 'text_media';
export const FLASHCARD = 'flashcard';
export const FILL_THE_GAPS = 'fill_the_gaps';
export const MULTIPLE_CHOICE_QUESTION = 'multiple_choice_question';
export const SINGLE_CHOICE_QUESTION = 'single_choice_question';
export const ORDER_THE_SEQUENCE = 'order_the_sequence';
export const OPEN_QUESTION = 'open_question';
export const SURVEY = 'survey';
export const QUESTION_ANSWER = 'question_answer';

// QUESTIONNAIRE
export const PUBLISHED = 'published';
export const EXPECTATIONS = 'expectations';
export const END_OF_COURSE = 'end_of_course';
export const SELF_POSITIONNING = 'self_positionning';
export const START_COURSE = 'start_course';
export const END_COURSE = 'end_course';

// ROLE
export const VENDOR_ADMIN = 'vendor_admin';
export const TRAINING_ORGANISATION_MANAGER = 'training_organisation_manager';
export const TRAINER = 'trainer';

// COURSE MODE
export const LEARNER = 'learner';
export const TESTER = 'tester';
export const TUTOR = 'tutor';

// REGEX
export const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}(?:[\s]*)$/;
export const COUNTRY_CODE_REGEX = /^\+([1-9][0-9]{0,2})$/;
export const EMAIL_REGEX = /^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/;

// MEDIA TYPES
export const IMAGE = 'image';
export const AUDIO = 'audio';
export const PDF = 'pdf';

// ORIGIN
export const MOBILE = 'mobile';

// TYPE
export const EMAIL = 'email';
export const PHONE = 'phone';

// MEDIA
export const IMAGE_MAX_SIZE = 5242880;

// STATE
export const ACTIVE_STATE = 'active';

// SWIPE
export const SWIPE_SENSIBILITY = 20;

// NOTIFICATION
export const DENIED = 'denied';
export const GRANTED = 'granted';
export const BLENDED_COURSE_REGISTRATION = 'blended_course_registration';
export const NEW_ELEARNING_COURSE = 'new_elearning_course';
export const ATTENDANCE_SHEET_SIGNATURE_REQUEST = 'attendance_sheet_signature_request';

// CONTEXT
export const BEFORE_SIGNIN = 'beforeSignin';
export const SIGNIN = 'signin';
export const SIGNIN_ERROR = 'signinError';
export const RESET_ERROR = 'resetError';
export const SIGNOUT = 'signout';
export const RENDER = 'render';

// COMPANIDATE FORMATS
export const DD_MM_YYYY = 'dd/LL/yyyy';
export const HH_MM = 'T';
export const MONTH_SHORT = 'LLL';
export const DAY = 'day';
export const DAY_OF_MONTH = 'd';
export const DAY_OF_WEEK_SHORT = 'ccc';
export const YEAR = 'yyyy';
export const DAY_D_MONTH = 'cccc d LLLL';
export const DAY_D_MONTH_YEAR = 'ccc d LLL yyyy';

// COMPANIDURATION FORMATS
export const LONG_DURATION_H_MM = 'h\'h\' mm\'min\'';
export const SHORT_DURATION_H_MM = 'h\'h\'mm';

// COMPANIDURATION
export const PT0S = 'PT0S';

// FIRST MOBILE CONNECTION MODE
export const AUTHENTICATION = 'authentication';
export const LOGIN_CODE = 'login_code';
export const IDENTITY_VERIFICATION = 'identity_verification';
export const ACCOUNT_CREATION = 'account_creation';

// COMPANIES
export const DIRECTORY = 'directory';

// COURSE STATUS
export const IN_PROGRESS = 'in_progress';
export const FORTHCOMING = 'forthcoming';
export const COMPLETED = 'completed';
