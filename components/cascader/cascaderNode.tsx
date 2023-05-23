import {
    defineComponent,
    computed,
    ref,
    ExtractPropTypes,
    PropType,
    nextTick,
} from 'vue';
import { isArray, isUndefined } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import LoadingOutlined from '../icon/LoadingOutlined';
import RightOutlined from '../icon/RightOutlined';
import CheckOutlined from '../icon/CheckOutlined';
import Checkbox from '../checkbox';
import Radio from '../radio';
import Ellipsis from '../ellipsis';
import Tooltip from '../tooltip';
import { useLocale } from '../config-provider/useLocale';
import useCascaderNode from './useCascaderNode';
import { CHECK_STRATEGY, COMPONENT_NAME, EXPAND_TRIGGER } from './const';

const prefixCls = getPrefixCls('cascader-node');

const cascaderNodeProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
    },
    selectable: {
        type: Boolean,
    },
    checkable: {
        type: Boolean,
    },
    isLeaf: {
        type: Boolean,
        default: false,
    },
    level: {
        type: Number,
        default: 0,
    },
} as const;

export type CascaderNodeProps = Partial<
    ExtractPropTypes<typeof cascaderNodeProps>
>;

export default defineComponent({
    name: COMPONENT_NAME.CASCADER_NODE,
    props: cascaderNodeProps,
    setup(props, { slots }) {
        const {
            root,
            isExpanded,
            isInitLoading,
            isSelected,
            isChecked,
            isIndeterminate,
            isLoaded,
            isCheckLoaded,
            isActive,
        } = useCascaderNode(props);

        const disabled = computed(() => props.disabled);
        const selectable = computed(() =>
            isUndefined(props.selectable)
                ? root.props.selectable
                : props.selectable,
        );
        const checkable = computed(() =>
            isUndefined(props.checkable)
                ? root.props.checkable
                : props.checkable,
        );

        const classList = computed(() =>
            [
                prefixCls,
                disabled.value && 'is-disabled',
                isExpanded.value && 'is-expanded',
                isSelected.value && 'is-selected',
                isChecked.value && 'is-checked',
                isActive.value && 'is-active',
            ].filter(Boolean),
        );

        const { t } = useLocale();
        const loadingRequiredMessage = computed(() =>
            t('cascader.loadingRequiredMessage', {
                label: props.label,
            }),
        );

        const isLoading = ref(false);
        const handleClickSwitcher = async (event: Event) => {
            if (isInitLoading.value || isLoading.value) {
                return;
            }
            const node = root.nodeList[props.value];
            if (!isLoaded.value) {
                isLoading.value = true;
                try {
                    const children = await root.props.loadData({
                        ...node.origin,
                    });
                    if (isArray(children)) {
                        node.origin.children = children;

                        // 当前操作节点信息重新生成后再继续展开操作
                        await nextTick();
                        root.expandNode(props.value, event);
                    }
                } catch (e) {
                    console.error(e);
                }
                isLoading.value = false;
            } else {
                root.expandNode(props.value, event);
            }
        };
        const handleHoverSwitcher = (event: Event) => {
            if (root.props.expandTrigger !== EXPAND_TRIGGER.HOVER) {
                return;
            }
            handleClickSwitcher(event);
        };
        const handleClickContent = (event: Event) => {
            // 若为非叶子节点，则直接展开操作
            if (!props.isLeaf) {
                return handleClickSwitcher(event);
            }

            if (disabled.value) return;
            // 再 select 行为
            if (selectable.value) {
                return root.selectNode(props.value, event);
            }
            // 再 check 行为
            if (checkable.value && isCheckLoaded.value) {
                return root.checkNode(props.value, event);
            }
        };
        const handleHoverContent = (event: Event) => {
            if (root.props.expandTrigger !== EXPAND_TRIGGER.HOVER) {
                return;
            }
            // 若为非叶子节点，则直接展开操作
            if (!props.isLeaf) {
                return handleClickSwitcher(event);
            }
        };
        const handleClickCheckbox = (event: Event) => {
            if (disabled.value) return;
            if (checkable.value && isCheckLoaded.value) {
                return root.checkNode(props.value, event);
            }
        };
        const handleClickRadio = (event: Event) => {
            if (disabled.value) return;
            // 仅 select 行为
            if (selectable.value) {
                return root.selectNode(props.value, event);
            }
        };
        const handleStopClickPrefix = (event: Event) => {
            event.stopPropagation();
        };
        const renderSwitcher = () => {
            const currentClassList = [
                `${prefixCls}-switcher`,
                disabled.value && 'is-disabled',
            ].filter(Boolean);

            if (props.isLeaf) {
                return (
                    <span class={currentClassList}>
                        {!checkable.value && isSelected.value ? (
                            <CheckOutlined />
                        ) : null}
                    </span>
                );
            }
            return (
                <span
                    class={currentClassList}
                    onClick={handleClickSwitcher}
                    onMouseenter={handleHoverSwitcher}
                >
                    {isInitLoading.value || isLoading.value ? (
                        <LoadingOutlined />
                    ) : (
                        <RightOutlined />
                    )}
                </span>
            );
        };
        const renderCheckbox = () => {
            if (checkable.value) {
                return (
                    <span class={`${prefixCls}-checkbox`}>
                        {isCheckLoaded.value ? (
                            <Checkbox
                                indeterminate={isIndeterminate.value}
                                modelValue={isChecked.value}
                                onClick={handleClickCheckbox}
                                disabled={props.disabled}
                            />
                        ) : (
                            <Tooltip
                                placement="top-start"
                                content={loadingRequiredMessage.value}
                            >
                                <Checkbox
                                    indeterminate={isIndeterminate.value}
                                    modelValue={isChecked.value}
                                    disabled={true}
                                />
                            </Tooltip>
                        )}
                    </span>
                );
            }
            return null;
        };
        const renderRadio = () => {
            if (
                !checkable.value &&
                selectable.value &&
                root.props.checkStrictly === CHECK_STRATEGY.ALL
            ) {
                return (
                    <span class={`${prefixCls}-radio`}>
                        <Radio
                            modelValue={isSelected.value}
                            onClick={handleClickRadio}
                            disabled={props.disabled}
                        />
                    </span>
                );
            }
            return null;
        };
        const renderPrefix = () => {
            if (!slots.prefix) return null;
            return (
                <span
                    class={`${prefixCls}-content-prefix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.prefix?.()}
                </span>
            );
        };
        const renderSuffix = () => {
            if (!slots.suffix) return null;
            return (
                <span
                    class={`${prefixCls}-content-suffix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.suffix?.()}
                </span>
            );
        };
        return () => (
            <div
                class={classList.value}
                data-value={props.value}
                role="cascader-node"
            >
                {renderCheckbox()}
                {renderRadio()}
                <span
                    class={`${prefixCls}-content`}
                    onClick={handleClickContent}
                    onMouseenter={handleHoverContent}
                >
                    {renderPrefix()}
                    <span class={`${prefixCls}-content-label`}>
                        <Ellipsis content={props.label}></Ellipsis>
                    </span>
                    {renderSuffix()}
                </span>
                {renderSwitcher()}
            </div>
        );
    },
});
