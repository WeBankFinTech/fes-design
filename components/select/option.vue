<template>
    <div
        v-show="isShow"
        ref="optionRef"
        :class="classList"
        @click="handleClick"
    >
        <slot :isChecked="isChecked">
            <Ellipsis :triggerClass="`${prefixCls}-label`">
                {{ label }}
            </Ellipsis>
            <CheckOutlined
                v-if="isChecked"
                :class="`${prefixCls}-checked-icon`"
            />
        </slot>
    </div>
</template>
<script>
import { computed, inject, onMounted, ref } from 'vue';
import Ellipsis from '../ellipsis';
import { key } from './const';
import getPrefixCls from '../_util/getPrefixCls';
import CheckOutlined from '../icon/CheckOutlined';

const prefixCls = getPrefixCls('select-option');

export default {
    name: 'FOption',
    components: {
        CheckOutlined,
        Ellipsis,
    },
    props: {
        value: {
            type: [String, Number, Boolean, Object],
            required: true,
        },
        label: {
            type: String,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const parent = inject(key, null);
        if (!parent) {
            return console.error(
                '[FOption]: FOption 必须搭配 FSelect 组件使用！',
            );
        }
        const { isSelect, onSelect, addOption, filterText } = parent;

        const isShow = computed(
            () => !filterText.value || props.label.includes(filterText.value),
        );

        const isChecked = computed(() => isSelect(props.value));

        const classList = computed(() => {
            const arr = [
                prefixCls,
                isChecked.value && 'is-checked',
                props.disabled && 'is-disabled',
            ];
            return arr.filter(Boolean);
        });

        const optionRef = ref();

        onMounted(() => {
            const text = optionRef.value.innerText;
            const option = { ...props };
            if (!option.label && text) {
                option.label = text;
            }
            addOption(option);
        });

        const handleClick = () => {
            if (props.disabled) return;
            onSelect(props.value);
        };

        return {
            isChecked,
            prefixCls,
            handleClick,
            classList,
            isShow,
            optionRef,
        };
    },
};
</script>
