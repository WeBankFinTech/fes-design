import {
    defineComponent,
    ExtractPropTypes,
    nextTick,
    onMounted,
    PropType,
    ref,
    VNodeChild,
    watch,
} from 'vue';
import { isFunction, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import LoadingOutlined from '../icon/LoadingOutlined';
import Scrollbar from '../scrollbar';
import getElementFromVueInstance from '../_util/getElementFromVueInstance';
import { COMPONENT_NAME } from './const';
import useCascaderMenu from './useCascaderMenu';
import CascaderNode from './cascaderNode';
import { scrollIntoParentView } from './helper';
import type { InnerCascaderOption } from './interface';

const prefixCls = getPrefixCls('cascader-menu');
const scrollbarContainerClass = `${prefixCls}-dropdown`;
const nodePrefixCls = getPrefixCls('cascader-node');

const cascaderMenuProps = {
    menuKey: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    initialLoaded: Boolean,
    listEmptyText: String,
} as const;

export type CascaderMenuProps = Partial<
    ExtractPropTypes<typeof cascaderMenuProps>
>;

export default defineComponent({
    name: COMPONENT_NAME.CASCADER_MENU,
    props: cascaderMenuProps,
    setup(props) {
        const scrollbarRef = ref<HTMLElement>(null);

        const { menuNodes, isCascaderOpened, menuScrollNode } =
            useCascaderMenu(props);

        const renderNode = (node: InnerCascaderOption) => {
            const itemSlots: {
                [key: string]: () => VNodeChild | string;
            } = {};
            if (isFunction(node.prefix)) {
                itemSlots.prefix = node.prefix;
            }
            if (isString(node.prefix)) {
                itemSlots.prefix = () => node.prefix as string;
            }
            if (isFunction(node.suffix)) {
                itemSlots.suffix = node.suffix;
            }
            if (isString(node.suffix)) {
                itemSlots.suffix = () => node.suffix as string;
            }
            return (
                <CascaderNode
                    key={node.value}
                    level={node.level}
                    value={node.value}
                    label={node.label}
                    disabled={node.disabled}
                    selectable={node.selectable}
                    checkable={node.checkable}
                    isLeaf={node.isLeaf}
                    v-slots={itemSlots}
                ></CascaderNode>
            );
        };
        const renderNodes = (nodes: InnerCascaderOption[]) =>
            nodes.map((node) => renderNode(node));

        // 将第一个选中元素自动滚动到可见区域
        const doScrollNode = async () => {
            await nextTick();

            if (!isCascaderOpened.value || !menuScrollNode.value) {
                return;
            }

            const scrollbarEl = getElementFromVueInstance(
                scrollbarRef.value,
            ) as HTMLElement;
            const scrollbarContainerEl =
                scrollbarEl?.querySelector<HTMLElement>(
                    `.${scrollbarContainerClass}`,
                );
            const activeNodeEl =
                scrollbarContainerEl?.querySelector<HTMLElement>(
                    // matches unescaped double quotes
                    `.${nodePrefixCls}[data-value="${menuScrollNode.value.value}"]`,
                );

            if (activeNodeEl) {
                scrollIntoParentView(activeNodeEl, scrollbarContainerEl);
            }
        };

        onMounted(() => {
            // 监听当前 menu 展示状态
            watch(
                [isCascaderOpened, () => props.menuKey],
                () => {
                    doScrollNode();
                },
                {
                    flush: 'post',
                    immediate: true,
                },
            );
        });

        return () => (
            <Scrollbar
                ref={scrollbarRef}
                class={`${prefixCls}-scrollbar`}
                containerClass={scrollbarContainerClass}
                key={props.menuKey}
            >
                <div class={`${prefixCls}`} role="cascader-menu">
                    {menuNodes.value.length ? (
                        renderNodes(menuNodes.value)
                    ) : props.initialLoaded ? (
                        <div class={`${prefixCls}-null`}>
                            {props.listEmptyText}
                        </div>
                    ) : (
                        <div class={`${prefixCls}-loading`}>
                            <LoadingOutlined />
                        </div>
                    )}
                </div>
            </Scrollbar>
        );
    },
});
