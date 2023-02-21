<template>
    <div :class="wrapperClass" @click="toggle">
        <span :class="`${prefixCls}-inner`">
            <slot v-if="activeRef" name="active"></slot>
            <slot v-if="inactiveRef" name="inactive"></slot>
        </span>
        <LoadingOutlined v-if="loadingRef" :class="`${prefixCls}-loading`" />
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    onMounted,
    PropType,
    nextTick,
    ref,
} from 'vue';
import { isEqual, isFunction } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import LoadingOutlined from '../icon/LoadingOutlined';

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
    components: {
        LoadingOutlined,
    },
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
        const { validate, isDisabled } = useFormAdaptor();
        onMounted(() => {
            // 默认为未选中
            if (currentValue.value === undefined) {
                // 避免可能出现的bug https://github.com/vuejs/core/issues/5290
                nextTick(() => {
                    updateCurrentValue(props.inactiveValue);
                });
            }
        });

        const loadingRef = ref(false);

        const handleChange = () => {
            ctx.emit(CHANGE_EVENT, currentValue.value);
            validate(CHANGE_EVENT);
        };

        const activeRef = computed(() =>
            isEqual(currentValue.value, props.activeValue),
        );
        const inactiveRef = computed(() =>
            isEqual(currentValue.value, props.inactiveValue),
        );

        const toggle = async () => {
            if (props.disabled || isDisabled.value) return;
            if (isFunction(props.beforeChange)) {
                loadingRef.value = true;
                try {
                    const confirm = await props.beforeChange(
                        currentValue.value,
                    );
                    loadingRef.value = false;
                    if (confirm === false) {
                        return;
                    }
                } catch (e) {
                    loadingRef.value = false;
                    return;
                }
            }
            updateCurrentValue(
                activeRef.value ? props.inactiveValue : props.activeValue,
            );
            handleChange();
        };
        const wrapperClass = computed(() =>
            [
                prefixCls,
                props.size && `${prefixCls}-size-${props.size}`,
                activeRef.value && 'is-checked',
                (props.disabled || isDisabled.value) && 'is-disabled',
            ].filter(Boolean),
        );
        return {
            prefixCls,
            wrapperClass,
            toggle,
            activeRef,
            inactiveRef,
            loadingRef,
        };
    },
});
</script>
