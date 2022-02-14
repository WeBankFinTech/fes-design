import { withInstall } from '../_util/withInstall';
import DatePicker from './datePicker.vue';

import type { SFCWithInstall } from '../_util/interface';

type DatePickerType = SFCWithInstall<typeof DatePicker>;
export const FDatePicker = withInstall<DatePickerType>(
    DatePicker as DatePickerType,
);

export default FDatePicker;
