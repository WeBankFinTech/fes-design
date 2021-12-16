import { provide } from 'vue';
import { noop } from '../utils';
import { FORMITEM_INJECTION_KEY } from '../constants';

export default () => {
    provide(FORMITEM_INJECTION_KEY, { validate: noop });
};
