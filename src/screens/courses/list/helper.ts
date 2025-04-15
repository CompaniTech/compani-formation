// @ts-nocheck

import { BlendedCourseType } from '../../../types/CourseTypes';
import { StepType, ELearningStepType } from '../../../types/StepTypes';
import { COMPLETED, E_LEARNING, FORTHCOMING, IN_PROGRESS, TODAY } from '../../../core/data/constants';

export const getElearningSteps = (steps: StepType[]): ELearningStepType[] =>
  steps.filter(step => step.type === E_LEARNING) as ELearningStepType[];

export const getCourseStatus = (course: BlendedCourseType): string => {
  const hasUnplannedSlots = course.slotsToPlan.length;
  if (!course.slots.length && hasUnplannedSlots) return FORTHCOMING;
  const isAfterLastSlot = TODAY.isAfter(course.slots[course.slots.length - 1].endDate);
  const isBeforeFirstSlot = TODAY.isBefore(course.slots[0].startDate);

  if (!hasUnplannedSlots && isAfterLastSlot) return COMPLETED;
  if (isBeforeFirstSlot) return FORTHCOMING;

  return IN_PROGRESS;
};
