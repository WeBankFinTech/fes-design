import { provide } from 'vue';
import { noop } from '../utils';
import { FORM_ITEM_INJECTION_KEY } from '../constants';

export default () => {
    provide(FORM_ITEM_INJECTION_KEY, { validate: noop });
};
