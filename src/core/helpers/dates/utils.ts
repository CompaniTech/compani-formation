import CompaniDate from './companiDates';

type START_DATE_KEY = 'startDate';
type END_DATE_KEY = 'endDate';

type KeyDateType = START_DATE_KEY | END_DATE_KEY;

export const ascendingSort = (key: KeyDateType) => (a: any, b: any) => (CompaniDate(a[key]).isAfter(b[key]) ? 1 : -1);

export const descendingSort = (key: KeyDateType) => (a: any, b: any) => (CompaniDate(a[key]).isBefore(b[key]) ? 1 : -1);

export const formatSecondsToISODuration = (sec: number) => `PT${sec}S`;
