import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import TimePicker from './time-picker.vue';

type TimePickerType = SFCWithInstall<typeof TimePicker>;

export { timePickerProps } from './time-picker.vue';
export type { TimePickerProps } from './time-picker.vue';
export const FTimePicker = withInstall<TimePickerType>(
    TimePicker as TimePickerType,
);

export default FTimePicker;
