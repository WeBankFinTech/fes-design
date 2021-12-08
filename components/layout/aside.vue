<template>
    <aside :class="classList" :style="style">
        <slot></slot>
        <div
            v-if="collapsible && showTrigger"
            :class="`${prefixCls}-aside-trigger`"
            :style="style"
            @click="handleTrigger"
        >
            <template v-if="asiderPlacement === 'left'">
                <LeftOutlined v-if="!currentCollapsed" />
                <RightOutlined v-else />
            </template>
            <template v-else>
                <LeftOutlined v-if="currentCollapsed" />
                <RightOutlined v-else />
            </template>
        </div>
    </aside>
    <aside v-if="fixed" :class="`${prefixCls}-aside`" :style="style"></aside>
</template>
<script>
import { computed, inject, getCurrentInstance } from 'vue';
import LeftOutlined from '../icon/LeftOutlined';
import RightOutlined from '../icon/RightOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { noop } from '../_util/utils';
import { COMPONENT_NAME, KEY } from './const';

const prefixCls = getPrefixCls('layout');
export default {
    name: COMPONENT_NAME.ASIDE,
    components: {
        LeftOutlined,
        RightOutlined,
    },
    props: {
        collapsible: {
            type: Boolean,
            default: false,
        },
        collapsed: {
            type: Boolean,
        },
        collapsedWidth: {
            type: String,
            default: '48px',
        },
        width: {
            type: String,
            default: '200px',
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        inverted: {
            type: Boolean,
            default: false,
        },
        showTrigger: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, { emit }) {
        const vm = getCurrentInstance();
        if (!vm.parent || !vm.parent.type || vm.parent.type.name !== COMPONENT_NAME.LAYOUT) {
            console.warn(`[${COMPONENT_NAME.ASIDE}] must be a child of ${COMPONENT_NAME.LAYOUT}`);
        }
        const { addChild, asiderPlacement } = inject(KEY, { addChild: noop, asiderPlacement: { value: '' } });
        const [currentCollapsed, updateCurrentCollapsed] = useNormalModel(
            props,
            emit,
            { prop: 'collapsed' },
        );
        const classList = computed(() => [
            `${prefixCls}-aside`,
            props.fixed && 'is-fixed',
            props.showTrigger && 'is-has-trigger',
            props.inverted && 'is-inverted',
            (props.collapsible && currentCollapsed.value) && 'is-collapsed',
            asiderPlacement.value && `is-placement-${asiderPlacement.value}`,
        ].filter(Boolean));
        const style = computed(() => ({
            width: props.collapsible && currentCollapsed.value
                ? props.collapsedWidth
                : props.width,
        }));
        const handleTrigger = () => {
            updateCurrentCollapsed(!currentCollapsed.value);
        };
        addChild({
            type: COMPONENT_NAME.ASIDE,
        });
        return {
            prefixCls,
            classList,
            style,
            handleTrigger,
            currentCollapsed,
            asiderPlacement,
        };
    },
};
</script>
