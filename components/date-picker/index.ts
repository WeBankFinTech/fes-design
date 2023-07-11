import { withInstall } from '../_util/withInstall';
import DatePicker from './datePicker.vue';

import type { SFCWithInstall } from '../_util/interface';

export { datePickerProps } from './datePicker.vue';
export type { DatePickerProps } from './datePicker.vue';

type DatePickerType = SFCWithInstall<typeof DatePicker>;
export const FDatePicker = withInstall<DatePickerType>(
    DatePicker as DatePickerType,
);

export default FDatePicker;
