import {
    type PropType,
    computed,
    defineComponent,
    type ComponentObjectPropsOptions,
} from 'vue';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import Checkbox, { type CheckboxProps } from '../checkbox';
import { COMPONENT_NAME } from './const';

type InnerCheckboxModelValue = NonNullable<CheckboxProps['modelValue']>;
type InnerCheckboxIndeterminate = NonNullable<CheckboxProps['indeterminate']>;
export type CheckStatus = 'all' | 'some' | 'none';

export const calcCheckStatus = (
    checkedNum: number,
    optionNum: number,
): CheckStatus => {
    if (checkedNum === 0) return 'none';
    if (checkedNum === optionNum) return 'all';
    return 'some';
};

export const TransferCheckbox = defineComponent({
    name: `${COMPONENT_NAME}Checkbox`,
    props: {
        modelValue: {
            type: String as PropType<CheckStatus>,
            default: 'none' satisfies CheckStatus,
        },
        label: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    } satisfies ComponentObjectPropsOptions,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    setup: (props, { emit }) => {
        const modelValue = computed<CheckStatus>({
            get: () => props.modelValue,
            set: (nextValue) => {
                emit(UPDATE_MODEL_EVENT, nextValue);
            },
        });
        const derivedIndeterminate = // 公共 Checkbox 的 indeterminate 为单向 prop
            computed<InnerCheckboxIndeterminate>(
                () => modelValue.value === 'some',
            );
        const derivedModelValue = computed<InnerCheckboxModelValue>({
            get: () => modelValue.value === 'all', // 'some' 状态也视为未勾选，使得在此状态点击 checkbox，能变成勾选状态
            set: (nextValue) => {
                modelValue.value = nextValue ? 'all' : 'none';
            },
        });

        const handleChange = (value: InnerCheckboxModelValue): void => {
            const nextModelValue = value ? 'all' : 'none';
            emit(UPDATE_MODEL_EVENT, nextModelValue);
            emit(CHANGE_EVENT, nextModelValue);
        };

        return () => (
            <Checkbox
                v-model={derivedModelValue.value}
                indeterminate={derivedIndeterminate.value}
                label={props.label}
                disabled={props.disabled}
                onChange={handleChange}
            />
        );
    },
});
