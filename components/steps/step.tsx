import {
    type CSSProperties,
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onMounted,
    onUnmounted,
    ref,
} from 'vue';
import { isNil } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import { CheckOutlined, CloseOutlined } from '../icon';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, PROVIDE_KEY, STATUS } from './const';

const prefixCls = getPrefixCls('step');

export const stepProps = {
    description: {
        type: String,
    },
    title: {
        type: String,
    },
    status: {
        type: String as PropType<(typeof STATUS)[keyof typeof STATUS]>,
    },
} as const satisfies ComponentObjectPropsOptions;

export type StepProps = ExtractPublicPropTypes<typeof stepProps>;

export default defineComponent({
    name: COMPONENT_NAME.STEP,
    components: {
        CloseOutlined,
        CheckOutlined,
    },
    props: stepProps,
    emits: ['clickStep'],
    setup(props, { slots, emit }) {
        const vm = getCurrentInstance();
        if (
            !vm
            || !vm.parent
            || !vm.parent.type
            || vm.parent.type.name !== COMPONENT_NAME.STEPS
        ) {
            console.warn(
                `[${COMPONENT_NAME.STEP}] must be a child of ${COMPONENT_NAME.STEPS}`,
            );
        }
        const parent = inject(PROVIDE_KEY, {
            current: ref(),
            parentDomRef: ref(null),
            props: { initial: 1 },
            count: ref(0),
            onUpdate: noop,
        });
        const itemDomRef = ref();
        const index = computed(() => {
            // 用parent.count触发更新
            void parent.count.value;
            const parentDom = parent.parentDomRef.value;
            const itemDom = itemDomRef.value;
            if (parentDom && itemDom) {
                return (
                    Array.from(parentDom.children).indexOf(itemDom)
                    + parent.props.initial
                );
            }
            return parent.props.initial - 1;
        });
        const style = computed(() => {
            // 用parent.count触发更新
            void parent.count.value;
            const _style: CSSProperties = {};
            const parentDom = parent.parentDomRef.value;
            if (parentDom && !parent.props.vertical) {
                const lastChild
                    = index.value
                    === parentDom.children.length - 1 + parent.props.initial;
                if (lastChild) {
                    _style['max-width'] = `${
                        (1 / parentDom.children.length) * 100
                    }%`;
                }
            }
            return _style;
        });
        const status = computed(() => {
            if (props.status) {
                return props.status;
            }
            const current = isNil(parent.current.value)
                ? parent.props.initial
                : parent.current.value;
            if (index.value < current) {
                return STATUS.FINISH;
            }
            if (index.value > current) {
                return STATUS.WAIT;
            }
            return parent.props.status;
        });
        const classList = computed(() =>
            [prefixCls, `is-${status.value}`].filter(Boolean).join(' '),
        );
        const onClickStep = () => {
            emit('clickStep', index.value);
        };
        const renderSymbol = () => {
            let content;
            if (slots.icon) {
                content = (
                    <span class={`${prefixCls}-icon`}>{slots.icon()}</span>
                );
            } else if (
                status.value === STATUS.WAIT
                || status.value === STATUS.PROCESS
            ) {
                content = index.value;
            } else if (status.value === STATUS.FINISH) {
                content = (
                    <span class={`${prefixCls}-icon`}>
                        <CheckOutlined />
                    </span>
                );
            } else if (status.value === STATUS.ERROR) {
                content = (
                    <span class={`${prefixCls}-icon`}>
                        <CloseOutlined />
                    </span>
                );
            }
            return (
                <div class={`${prefixCls}-symbol`}>
                    <div class={`${prefixCls}-symbol-wrapper`} onClick={onClickStep}>{content}</div>
                    {parent.props.vertical && (
                        <div class={`${prefixCls}-tail`}></div>
                    )}
                </div>
            );
        };

        onMounted(() => {
            parent.onUpdate();
        });

        onUnmounted(() => {
            parent.onUpdate();
        });

        return () => (
            <div ref={itemDomRef} class={classList.value} style={style.value}>
                {renderSymbol()}
                <div class={`${prefixCls}-content`}>
                    <div class={`${prefixCls}-title`}>
                        <span class={`${prefixCls}-text`} onClick={onClickStep}>
                            {slots.title?.() || `${props.title}`}
                        </span>
                        {!parent.props.vertical && (
                            <div class={`${prefixCls}-tail`}></div>
                        )}
                    </div>
                    <div class={`${prefixCls}-description`}>
                        {(slots.description || props.description)
                        && (slots.description?.() || props.description)}
                    </div>
                </div>
            </div>
        );
    },
});
