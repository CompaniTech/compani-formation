import { E_LEARNING, ON_SITE, REMOTE } from '../core/data/constants';
import { ActivityType } from './ActivityTypes';
import { SlotType } from './CourseTypes';

type BaseStepType = {
  _id: string,
  progress: { live: number, eLearning: number },
  type: string,
  name: string,
}

export type ELearningStepType = BaseStepType &
{ type: typeof E_LEARNING, activities: ActivityType[], theoreticalDuration: string }

export type LiveStepType = BaseStepType & {
  type: typeof ON_SITE | typeof REMOTE,
  activities: ActivityType[],
  slots: SlotType[]
}
export type StepType = ELearningStepType | LiveStepType;

export type NextSlotsStepType = BaseStepType & {
  type: typeof ON_SITE | typeof REMOTE,
  stepIndex: number,
  firstSlot: Date,
  slots: Date[],
  courseId: string,
  misc?: string,
};
