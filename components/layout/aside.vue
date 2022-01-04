<template>
    <aside :class="classList" :style="style">
        <slot></slot>
        <div
            v-if="collapsible && showTrigger"
            :class="`${prefixCls}-aside-trigger`"
            :style="style"
            @click="handleTrigger"
        >
            <template v-if="asidePlacement === 'left'">
                <LeftOutlined v-if="!currentCollapsed" />
                <RightOutlined v-else />
            </template>
            <template v-else>
                <LeftOutlined v-if="currentCollapsed" />
                <RightOutlined v-else />
            </template>
        </div>
    </aside>
</template>
<script setup lang="ts">
import { computed, inject, getCurrentInstance, ref } from 'vue';
import LeftOutlined from '../icon/LeftOutlined';
import RightOutlined from '../icon/RightOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

import type { AsidePlacement } from './interface';

const prefixCls = getPrefixCls('layout');

interface AsideProps {
    collapsible?: boolean;
    collapsed?: boolean;
    collapsedWidth?: string;
    width?: string;
    fixed?: boolean;
    inverted?: boolean;
    bordered?: boolean;
    showTrigger?: boolean;
}

type AsideEmits = {
    (e: 'update:collapsed', value: boolean): void;
};
const emit = defineEmits<AsideEmits>();

const props = withDefaults(defineProps<AsideProps>(), {
    collapsible: false,
    collapsedWidth: '48px',
    width: '200px',
    fixed: false,
    inverted: false,
    bordered: false,
    showTrigger: true,
});

const vm = getCurrentInstance();
if (
    !vm.parent ||
    !vm.parent.type ||
    vm.parent.type.name !== COMPONENT_NAME.LAYOUT
) {
    console.warn(
        `[${COMPONENT_NAME.ASIDE}] must be a child of ${COMPONENT_NAME.LAYOUT}`,
    );
}
const { addChild, asidePlacement } = inject(LAYOUT_PROVIDE_KEY, {
    addChild: noop,
    asidePlacement: ref<AsidePlacement>(''),
});
const [currentCollapsed, updateCurrentCollapsed] = useNormalModel(props, emit, {
    prop: 'collapsed',
});
const classList = computed(() =>
    [
        `${prefixCls}-aside`,
        props.fixed && 'is-fixed',
        props.collapsible && props.showTrigger && 'is-has-trigger',
        props.inverted && 'is-inverted',
        props.collapsible && currentCollapsed.value && 'is-collapsed',
        asidePlacement.value && `is-placement-${asidePlacement.value}`,
        props.bordered && 'is-bordered',
    ].filter(Boolean),
);
const style = computed(() => ({
    width:
        props.collapsible && currentCollapsed.value
            ? props.collapsedWidth
            : props.width,
}));
const handleTrigger = () => {
    updateCurrentCollapsed(!currentCollapsed.value);
};
addChild({
    type: COMPONENT_NAME.ASIDE,
});
</script>

<script lang="ts">
export default {
    name: COMPONENT_NAME.ASIDE,
};
</script>
