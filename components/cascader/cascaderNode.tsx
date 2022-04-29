import {
    defineComponent,
    computed,
    ref,
    ExtractPropTypes,
    PropType,
} from 'vue';
import { isUndefined } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import LoadingOutlined from '../icon/LoadingOutlined';
import RightOutlined from '../icon/RightOutlined';
import CheckOutlined from '../icon/CheckOutlined';
import Checkbox from '../checkbox/checkbox.vue';
import { COMPONENT_NAME } from './const';
import useCascaderNode from './useCascaderNode';
import Ellipsis from '../ellipsis';
import Tooltip from '../tooltip';
import { useLocale } from '../config-provider/useLocale';

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
            isSelected,
            isChecked,
            isIndeterminate,
            isLoaded,
            isCheckNeedLoad,
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
            ].filter(Boolean),
        );

        const { t } = useLocale();
        const loadingRequiredMessage = computed(() =>
            t('cascader.loadingRequiredMessage', {
                label: props.label,
            }),
        );

        const isLoading = ref(false);
        const handleClickSwitcher = async (event?: Event) => {
            if (isLoading.value) {
                return;
            }
            const node = root.nodeList[props.value];
            if (!isLoaded.value) {
                isLoading.value = true;
                try {
                    await root.props.loadData(node.origin);
                    root.expandNode(props.value, event);
                } catch (e) {
                    console.error(e);
                }
                isLoading.value = false;
            } else {
                root.expandNode(props.value, event);
            }
        };
        const handleClickContent = (event: Event) => {
            if (disabled.value) return;
            // 默认 select 行为
            if (selectable.value) {
                return root.selectNode(props.value, event);
            }
            // 再 check 行为
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
            // 再展开行为
            if (!props.isLeaf) {
                handleClickSwitcher(event);
            }
        };
        const handleClickCheckbox = (event: Event) => {
            if (disabled.value) return;
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
        };
        const handleStopClickPrefix = (event: Event) => {
            event.stopPropagation();
        };
        const renderSwitcher = () => {
            if (props.isLeaf) {
                return (
                    <span class={`${prefixCls}-switcher`}>
                        {!root.props.checkable && isSelected.value ? (
                            <CheckOutlined />
                        ) : null}
                    </span>
                );
            }
            return (
                <span
                    class={`${prefixCls}-switcher`}
                    onClick={handleClickSwitcher}
                >
                    {isLoading.value ? <LoadingOutlined /> : <RightOutlined />}
                </span>
            );
        };
        const renderCheckbox = () => {
            if (root.props.checkable) {
                return (
                    <span class={`${prefixCls}-checkbox`}>
                        {isCheckNeedLoad.value ? (
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
                        ) : (
                            <Checkbox
                                indeterminate={isIndeterminate.value}
                                modelValue={isChecked.value}
                                onClick={handleClickCheckbox}
                                disabled={props.disabled}
                            />
                        )}
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
                <span
                    class={`${prefixCls}-content`}
                    onClick={handleClickContent}
                >
                    {renderPrefix()}
                    <span class={`${prefixCls}-content-label`}>
                        <Ellipsis>{props.label}</Ellipsis>
                    </span>
                    {renderSuffix()}
                </span>
                {renderSwitcher()}
            </div>
        );
    },
});
