<template>
    <div :class="wrapperClass" @click="toggle">
        <span :class="`${prefixCls}-inner`">
            <slot v-if="actived" name="active"></slot>
            <slot v-if="inactived" name="inactive"></slot>
        </span>
    </div>
</template>
<script>
import { defineComponent, computed, watch, onMounted } from 'vue';
import { isEqual, isFunction } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';

const prefixCls = getPrefixCls('switch');

export default defineComponent({
    name: 'FSwitch',
    props: {
        modelValue: {
            type: [String, Array, Object, Number, Boolean],
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        activeValue: {
            type: [String, Array, Object, Number, Boolean],
            default: true,
        },
        inactiveValue: {
            type: [String, Array, Object, Number, Boolean],
            default: false,
        },
        beforeChange: Function,
        size: {
            type: String,
            validator(value) {
                return ['normal', 'small'].includes(value);
            },
            default: 'normal',
        },
    },
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
                props.size && `${prefixCls}-size-${props.size}`,
                actived.value && 'is-checked',
                props.disabled && 'is-disabled',
            ].filter(Boolean),
        );
        return {
            prefixCls,
            wrapperClass,
            actived,
            inactived,
            toggle,
        };
    },
});
</script>
