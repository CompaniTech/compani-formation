import { SlotType, TraineeType, TrainerType } from './CourseTypes';

type SignaturesType = {
  trainerSignature: { trainerId: string, signature: string },
  traineesSignature: { trainerId: string, signature: string }[]
}

type BaseAttendanceSheetType = {
  _id: string,
  course: string,
  file: { publicId: string, link: string },
  trainer: TrainerType,
  slots?: ({ slotId: SlotType } & SignaturesType)[]
}

export type IntraOrIntraHoldingAttendanceSheetType = BaseAttendanceSheetType & { date: Date }

export type InterAttendanceSheetType = BaseAttendanceSheetType & { trainee: TraineeType }

export type SingleAttendanceSheetType = BaseAttendanceSheetType &
  { trainee: TraineeType, slots: ({ slotId: SlotType } & SignaturesType)[]}

export type AttendanceSheetType = IntraOrIntraHoldingAttendanceSheetType | InterAttendanceSheetType
| SingleAttendanceSheetType

export function isIntraOrIntraHolding(sheet: AttendanceSheetType): sheet is IntraOrIntraHoldingAttendanceSheetType {
  return (sheet as IntraOrIntraHoldingAttendanceSheetType).date !== undefined;
}
