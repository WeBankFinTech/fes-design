<template>
    <aside :class="classList" :style="style">
        <FScrollbar
            :style="[
                collapsible && showTrigger && { height: 'calc(100% - 48px)' },
            ]"
            :thumb-style="[
                inverted && {
                    backgroundColor: '#fff',
                },
            ]"
        >
            <slot></slot>
        </FScrollbar>
        <div
            v-if="collapsible && showTrigger"
            :class="`${prefixCls}-aside-trigger`"
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

<script lang="ts">
import {
    type ComponentObjectPropsOptions,
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    ref,
} from 'vue';
import { FScrollbar } from '../scrollbar';
import LeftOutlined from '../icon/LeftOutlined';
import RightOutlined from '../icon/RightOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { noop } from '../_util/utils';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, LAYOUT_PROVIDE_KEY } from './const';

export type AsidePlacement = 'left' | 'right' | '';

const prefixCls = getPrefixCls('layout');

export const layoutAsideProps = {
    collapsed: {
        type: Boolean,
    },
    collapsible: {
        type: Boolean,
        default: false,
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
    bordered: {
        type: Boolean,
        default: false,
    },
    showTrigger: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type LayoutAsideProps = ExtractPublicPropTypes<typeof layoutAsideProps>;

export default defineComponent({
    name: COMPONENT_NAME.ASIDE,
    components: {
        FScrollbar,
        LeftOutlined,
        RightOutlined,
    },
    props: layoutAsideProps,
    emits: ['update:collapsed'],
    setup(props, { emit }) {
        const vm = getCurrentInstance();
        if (
            !vm.parent
            || !vm.parent.type
            || vm.parent.type.name !== COMPONENT_NAME.LAYOUT
        ) {
            console.warn(
                `[${COMPONENT_NAME.ASIDE}] must be a child of ${COMPONENT_NAME.LAYOUT}`,
            );
        }
        const { addChild, asidePlacement } = inject(LAYOUT_PROVIDE_KEY, {
            addChild: noop,
            asidePlacement: ref<AsidePlacement>(''),
        });
        const [currentCollapsed, updateCurrentCollapsed] = useNormalModel(
            props,
            emit,
            {
                prop: 'collapsed',
            },
        );
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

        return {
            prefixCls,
            classList,
            style,
            handleTrigger,
            asidePlacement,
            currentCollapsed,
        };
    },
});
</script>
