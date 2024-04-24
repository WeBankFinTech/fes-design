import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Calendar from './calendar';

export { calendarProps } from './props';
export type { CalendarProps } from './props';

type CalendarType = SFCWithInstall<typeof Calendar>;
export const FCalendar = withInstall<CalendarType>(Calendar as CalendarType);

export default FCalendar;
