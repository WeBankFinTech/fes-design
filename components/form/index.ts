import { withInstall, withNoopInstall } from '../_util/withInstall';
import Form from './form.vue';
import FormItem from './formItem.vue';

export const FForm = withInstall(Form, { FormItem });
export const FFormItem = withNoopInstall(FormItem);

export default FForm;
