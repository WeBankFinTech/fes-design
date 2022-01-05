import { withInstall } from '../_util/withInstall';
import TimePicker from './time-picker.vue';

import type { SFCWithInstall } from '../_util/interface';

type TimePickerType = SFCWithInstall<typeof TimePicker>;
export const FTimePicker = withInstall<TimePickerType>(
    TimePicker as TimePickerType,
);

export default FTimePicker;
