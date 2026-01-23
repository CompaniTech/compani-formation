import pick from 'lodash/pick';
import { DateTime, Duration, DateTimeUnit } from './luxon';

type DateTypes = Date | CompaniDateType | string;

type ObjectDateType = {
  [key in DateTimeUnit]?: number
};

export type CompaniDateType = {
  _getDate: DateTime,
  getUnits: (units: DateTimeUnit[]) => ObjectDateType,
  format: (str: string) => string,
  toDate: () => Date,
  toISO: () => string,
  toMillis: () => number,
  isSame: (miscTypeOtherDate: DateTypes, unit: DateTimeUnit) => boolean,
  isBefore: (date: DateTypes, unit?: DateTimeUnit) => boolean,
  isAfter: (date: DateTypes, unit?: DateTimeUnit) => boolean,
  isSameOrAfter: (date: DateTypes, unit?: DateTimeUnit) => boolean,
  startOf: (unit: DateTimeUnit) => CompaniDateType,
  endOf: (unit: DateTimeUnit) => CompaniDateType,
  add: (amount: string) => CompaniDateType,
  set: (values: ObjectDateType) => CompaniDateType,
}

const CompaniDateFactory = (inputDate: DateTime): CompaniDateType => {
  const _date = inputDate;

  return ({
    // GETTER
    get _getDate() {
      return _date;
    },

    getUnits(units: DateTimeUnit[]) {
      return pick(_date.toObject(), units);
    },

    // DISPLAY
    format(fmt: string) {
      return _date.toFormat(fmt);
    },

    toDate() {
      return _date.toUTC().toJSDate();
    },

    toISO() {
      return _date.toUTC().toISO() || '';
    },

    toMillis() {
      return _date.toMillis();
    },

    // QUERY

    isSame(miscTypeOtherDate: DateTypes, unit : DateTimeUnit = 'millisecond') {
      const otherDate = _formatMiscToCompaniDate(miscTypeOtherDate);

      return _date.hasSame(otherDate, unit);
    },

    isBefore(miscTypeOtherDate: DateTypes, unit = 'millisecond') {
      const otherDate = _formatMiscToCompaniDate(miscTypeOtherDate);

      return _date.startOf(unit) < otherDate.startOf(unit);
    },

    isAfter(miscTypeOtherDate: DateTypes, unit = 'millisecond') {
      const otherDate = _formatMiscToCompaniDate(miscTypeOtherDate);

      return _date.startOf(unit) > otherDate.startOf(unit);
    },

    isSameOrAfter(miscTypeOtherDate: DateTypes, unit : DateTimeUnit = 'millisecond') {
      const otherDate = _formatMiscToCompaniDate(miscTypeOtherDate);

      return (_date.hasSame(otherDate, unit) || _date.startOf(unit) > otherDate.startOf(unit));
    },

    // MANIPULATE
    startOf(unit: DateTimeUnit) {
      return CompaniDateFactory(_date.startOf(unit));
    },

    endOf(unit: DateTimeUnit) {
      return CompaniDateFactory(_date.endOf(unit));
    },

    add(amount: string) {
      const isoDuration = Duration.fromISO(amount);
      return CompaniDateFactory(_date.plus(isoDuration));
    },

    set(values: ObjectDateType) {
      return CompaniDateFactory(_date.set(values));
    },
  });
};

const _formatMiscToCompaniDate = (...args: DateTypes[]) => {
  if (!args.length) return DateTime.now();

  if (args.length === 1) {
    if (args[0] instanceof Date) return DateTime.fromJSDate(args[0]);
    if (args[0] instanceof Object && args[0]?._getDate instanceof DateTime) return args[0]._getDate;
    if (typeof args[0] === 'string' && args[0] !== '') return DateTime.fromISO(args[0]);
  }

  if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
    const options = args[0].endsWith('Z') ? { zone: 'utc' } : {};
    return DateTime.fromFormat(args[0], args[1], options);
  }

  return DateTime.invalid('wrong arguments');
};

export default (...args: DateTypes[]): CompaniDateType => CompaniDateFactory(_formatMiscToCompaniDate(...args));
