import { Audio, AVPlaybackSource } from 'expo-av';
import BigNumber from 'bignumber.js';
import CompaniDuration from '../helpers/dates/companiDurations';
import { STRICTLY_E_LEARNING, LONG_FIRSTNAME_LONG_LASTNAME, SHORT_FIRSTNAME_LONG_LASTNAME } from '../data/constants';
import { UserType } from '../../types/UserType';
import { ELearningStepType } from '../../types/StepTypes';
import { CourseType } from '../../types/CourseTypes';

export const capitalize = (s: string): string => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatPhone = (phoneNumber: string): string => (phoneNumber
  ? phoneNumber.replace(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')
  : '');

export const formatPhoneForPayload = (phoneNumber: string): string => (phoneNumber
  ? phoneNumber.replace(/[\s\-.]/g, '')
  : '');

export const formatWordToPlural = (items: object[], text: string): string =>
  (items.length > 1 ? `${text}s` : `${text}`);

export const capitalizeFirstLetter = (s: string): string => `${s.charAt(0).toUpperCase()}${s.substr(1)}`;

const loadPlayAndUnloadAudio = async (track: AVPlaybackSource) => {
  const { sound } = await Audio.Sound.createAsync(track);

  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded || !status.didJustFinish) return;
    sound.unloadAsync();
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
    : 'PT0S'
);
