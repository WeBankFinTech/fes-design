import { withInstall, withNoopInstall } from '../_util/withInstall';
import Form from './form';
import FormItem from './formItem';

export const FForm = withInstall(Form, { FormItem });
export const FFormItem = withNoopInstall(FormItem);

export default FForm;
