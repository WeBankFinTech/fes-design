import { withInstall } from '../_util/withInstall';
import TimePicker from './time-picker.vue';

import type { SFCWithInstall } from '../_util/interface';

type TimePickerType = SFCWithInstall<typeof TimePicker>;

export { timePickerProps } from './time-picker.vue';
export type { TimePickerProps } from './time-picker.vue';
export const FTimePicker = withInstall<TimePickerType>(
    TimePicker as TimePickerType,
);

export default FTimePicker;
