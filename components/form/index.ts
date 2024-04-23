import { withInstall, withNoopInstall } from '../_util/withInstall';
export { default as useFormAdaptor } from '../_util/use/useFormAdaptor';
import type { SFCWithInstall } from '../_util/interface';
import Form from './form.vue';
import FormItem from './formItem.vue';

import { provideKey } from './const';

type FormType = SFCWithInstall<typeof Form>;
type FormItemType = SFCWithInstall<typeof FormItem>;

export { formProps } from './interface';
export type { FormProps } from './interface';
export const FForm = withInstall<FormType>(Form as FormType, { FormItem });

export { formItemProps } from './interface';
export type { FormItemProps } from './interface';
export const FFormItem = withNoopInstall<FormItemType>(
    FormItem as FormItemType,
);

export const formProvideKey = provideKey;

export default FForm;
