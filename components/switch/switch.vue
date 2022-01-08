<template>
    <div :class="wrapperClass" @click="toggle">
        <span :class="`${prefixCls}-inner`">
            <slot v-if="delayActived" name="active"></slot>
            <slot v-if="delayInActived" name="inactive"></slot>
        </span>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    watch,
    onMounted,
    ref,
    PropType,
    Ref,
} from 'vue';
import { isEqual, isFunction } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useAnimate } from '../_util/use/useAnimate';
import { CHANGE_EVENT } from '../_util/constants';

const prefixCls = getPrefixCls('switch');

const animateDuration = 300;

const useDelaySwtich = (actived: Ref<boolean>, inactived: Ref<boolean>) => {
    const delayActived = ref(actived.value);
    watch(actived, () => {
        setTimeout(() => {
            delayActived.value = actived.value;
        }, animateDuration / 2);
    });
    const delayInActived = ref(inactived.value);
    watch(inactived, () => {
        setTimeout(() => {
            delayInActived.value = inactived.value;
        }, animateDuration / 2);
    });

    return {
        delayActived,
        delayInActived,
    };
};

type SwitchValue = string | [] | object | number | boolean;
type SwitchSize = 'normal' | 'small';

// interface SwitchProps {
//     modelValue?: SwitchValue;
//     disabled?: boolean;
//     activeValue?: SwitchValue;
//     inactiveValue?: SwitchValue;
//     beforeChange?: (val: SwitchValue) => boolean | Promise<boolean>;
//     size?: SwitchSize;
// }

// type SwitchEmits = {
//     (e: VModelEvent, value: SwitchValue): void;
//     (e: ChangeEvent, value: SwitchValue): void;
// };

const switchProps = {
    modelValue: {
        type: [String, Array, Object, Number, Boolean] as PropType<SwitchValue>,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    activeValue: {
        type: [String, Array, Object, Number, Boolean] as PropType<SwitchValue>,
        default: true,
    },
    inactiveValue: {
        type: [String, Array, Object, Number, Boolean] as PropType<SwitchValue>,
        default: false,
    },
    beforeChange: Function as PropType<
        (val: SwitchValue) => boolean | Promise<boolean>
    >,
    size: {
        type: String as PropType<SwitchSize>,
        default: 'normal',
    },
} as const;

export default defineComponent({
    name: 'FSwitch',
    props: switchProps,
    setup(props, ctx) {
        const { handelAnimate, animateClassName } = useAnimate(animateDuration);
        useTheme();
        const [currentValue, updateCurrentValue] = useNormalModel(
            props,
            ctx.emit,
            {
                prop: 'modelValue',
                isEqual: true,
            },
        );
        onMounted(() => {
            // 默认为未选中
            if (currentValue.value === null) {
                updateCurrentValue(props.inactiveValue);
            }
        });

        watch(currentValue, () => {
            ctx.emit(CHANGE_EVENT, currentValue.value);
        });
        const actived = computed(() =>
            isEqual(currentValue.value, props.activeValue),
        );
        const inactived = computed(() =>
            isEqual(currentValue.value, props.inactiveValue),
        );

        const toggle = async () => {
            if (props.disabled) return;
            handelAnimate();
            if (isFunction(props.beforeChange)) {
                const confirm = await props.beforeChange(currentValue.value);
                if (!confirm) {
                    return;
                }
            }
            updateCurrentValue(
                actived.value ? props.inactiveValue : props.activeValue,
            );
        };
        const wrapperClass = computed(() =>
            [
                prefixCls,
                animateClassName.value,
                props.size && `${prefixCls}-size-${props.size}`,
                actived.value && 'is-actived',
                props.disabled && 'is-disabled',
            ].filter(Boolean),
        );
        return {
            prefixCls,
            wrapperClass,
            toggle,
            ...useDelaySwtich(actived, inactived),
        };
    },
});
</script>
