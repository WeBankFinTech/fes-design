<template>
    <div :class="wrapperClass" @click="toggle">
        <span :class="`${prefixCls}-inner`">
            <slot v-if="actived" name="active"></slot>
            <slot v-if="inactived" name="inactive"></slot>
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, PropType } from 'vue';
import { isEqual, isFunction } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';

const prefixCls = getPrefixCls('switch');

type SwitchValue = string | [] | object | number | boolean;
type SwitchSize = 'normal' | 'small';

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
        useTheme();
        const [currentValue, updateCurrentValue] = useNormalModel(
            props,
            ctx.emit,
            {
                prop: 'modelValue',
                isEqual: true,
            },
        );
        const { validate } = useFormAdaptor();
        onMounted(() => {
            // 默认为未选中
            if (currentValue.value === null) {
                updateCurrentValue(props.inactiveValue);
            }
        });

        const handleChange = () => {
            ctx.emit(CHANGE_EVENT, currentValue.value);
            validate(CHANGE_EVENT);
        };

        const actived = computed(() =>
            isEqual(currentValue.value, props.activeValue),
        );
        const inactived = computed(() =>
            isEqual(currentValue.value, props.inactiveValue),
        );

        const toggle = async () => {
            if (props.disabled) return;
            if (isFunction(props.beforeChange)) {
                const confirm = await props.beforeChange(currentValue.value);
                if (!confirm) {
                    return;
                }
            }
            updateCurrentValue(
                actived.value ? props.inactiveValue : props.activeValue,
            );
            handleChange();
        };
        const wrapperClass = computed(() =>
            [
                prefixCls,
                props.size && `${prefixCls}-size-${props.size}`,
                actived.value && 'is-checked',
                props.disabled && 'is-disabled',
            ].filter(Boolean),
        );
        return {
            prefixCls,
            wrapperClass,
            toggle,
            actived,
            inactived,
        };
    },
});
</script>
