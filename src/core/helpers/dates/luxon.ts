/* eslint-disable import/extensions */
import { Settings, DateTime, Duration, DateTimeUnit, ToRelativeUnit, DurationObjectUnits } from 'luxon';
import '@formatjs/intl-getcanonicallocales/polyfill.js';
import '@formatjs/intl-locale/polyfill.js';
import '@formatjs/intl-pluralrules/polyfill.js';
import '@formatjs/intl-pluralrules/locale-data/fr.js';
import '@formatjs/intl-numberformat/polyfill.js';
import '@formatjs/intl-numberformat/locale-data/fr.js';
import '@formatjs/intl-datetimeformat/polyfill.js';
import '@formatjs/intl-datetimeformat/locale-data/fr.js';
import '@formatjs/intl-datetimeformat/add-all-tz.js';

Settings.defaultLocale = 'fr';
Settings.defaultZone = 'Europe/Paris';
Settings.throwOnInvalid = true;

export { DateTime, DateTimeUnit, Duration, ToRelativeUnit, DurationObjectUnits };
