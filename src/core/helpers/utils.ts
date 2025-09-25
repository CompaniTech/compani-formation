import { AudioSource, createAudioPlayer } from 'expo-audio';
import BigNumber from 'bignumber.js';
import has from 'lodash/has';
import CompaniDuration from '../helpers/dates/companiDurations';
import {
  STRICTLY_E_LEARNING,
  LONG_FIRSTNAME_LONG_LASTNAME,
  SHORT_FIRSTNAME_LONG_LASTNAME,
  PT0S,
} from '../data/constants';
import { UserType } from '../../types/UserType';
import { ELearningStepType } from '../../types/StepTypes';
import { CourseType } from '../../types/CourseTypes';
import { diacriticsMap } from './diacritics';

export const capitalize = (s: string): string => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatPhone = (contact: { phone: string, countryCode: string }): string => (contact.phone
  ? `${contact.countryCode} ${contact.phone.substring(1)
    .replace(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')}`
  : '');

export const formatPhoneForPayload = (contact: { phone: string, countryCode: string }): Object => {
  if (!has(contact, 'phone')) return {};
  if (!contact.phone) return { phone: '' };
  return { phone: contact.phone.replace(/[\s\-.]/g, ''), countryCode: contact.countryCode };
};

export const formatWordToPlural = (items: object[], text: string): string =>
  (items.length > 1 ? `${text}s` : `${text}`);

export const capitalizeFirstLetter = (s: string): string => `${s.charAt(0).toUpperCase()}${s.substr(1)}`;

const loadPlayAndUnloadAudio = (track: AudioSource) => {
  const player = createAudioPlayer(track);

  player.play();

  player.addListener('playbackStatusUpdate', (status) => {
    if (status.didJustFinish) player.release();
  });
};

export const quizJingle = async (isGoodAnswer: boolean) => {
  const track = isGoodAnswer
    ? require('../../../assets/sounds/good-answer.mp3')
    : require('../../../assets/sounds/wrong-answer.mp3');
  loadPlayAndUnloadAudio(track);
};

export const achievementJingle = async () => {
  const track = require('../../../assets/sounds/ended-activity.mp3');
  loadPlayAndUnloadAudio(track);
};

type IdentityFormatType = typeof LONG_FIRSTNAME_LONG_LASTNAME | typeof SHORT_FIRSTNAME_LONG_LASTNAME;

export const formatIdentity = (identity: UserType['identity'], format: IdentityFormatType): string => {
  if (!identity) return '';

  const formatLower = format.toLowerCase();
  const values: string[] = [];

  for (let i = 0; i < format.length; i += 1) {
    let value;
    if (formatLower[i] === 'f') value = (identity.firstname || '').trim();
    else if (formatLower[i] === 'l') value = (identity.lastname || '').trim();

    if (!value) break;

    if (formatLower[i] === format[i]) value = `${value.charAt(0).toUpperCase()}.`;
    values.push(value);
  }

  return values.join(' ');
};

export const getCourseProgress = (course: CourseType) => {
  if (course.format === STRICTLY_E_LEARNING) return course.progress.eLearning || 0;

  return course.progress.blended || 0;
};

export const add = (...nums: number[]) => nums.reduce((acc, n) => new BigNumber(acc).plus(n).toNumber(), 0);

export const getTheoreticalDuration = (steps: ELearningStepType[]) : string => (
  steps.length
    ? steps
      .reduce((acc, value) => (value.theoreticalDuration ? acc.add(value.theoreticalDuration) : acc), CompaniDuration())
      .toISO()
    : PT0S
);

export const sortStrings = (a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase());

export const formatQuantity = (itemLabel: string, quantity: number, pluralMark = 's', displayQuantity = true) => {
  let label = itemLabel;
  if (quantity > 1) label = itemLabel.split(' ').map(word => `${word}${pluralMark}`).join(' ');

  return displayQuantity ? `${quantity} ${label}` : label;
};

export const getArrayDepth = (value: Array<any>): 0 | 1 | 2 => {
  if (!Array.isArray(value)) return 0;
  if (Array.isArray(value[0])) return 2;
  return 1;
};

export const removeDiacritics = (str: string) => str.replace(/[^\u0020-\u007E]/g, (a: string) => diacriticsMap[a] || a);
