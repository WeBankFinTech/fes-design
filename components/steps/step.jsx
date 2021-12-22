import {
    computed,
    getCurrentInstance,
    inject,
    defineComponent,
    ref,
} from 'vue';
import { isNil } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME, STATUS, PROVIDE_KEY } from './const';
import { CloseOutlined, CheckOutlined } from '../icon';

const prefixCls = getPrefixCls('step');

export default defineComponent({
    name: COMPONENT_NAME.STEP,
    components: {
        CloseOutlined,
        CheckOutlined,
    },
    props: {
        description: {
            type: String,
        },
        title: {
            type: String,
        },
        status: {
            type: String,
            validator(value) {
                return !value || Object.values(STATUS).includes(value);
            },
        },
    },
    setup(props, { slots }) {
        const vm = getCurrentInstance();
        if (
            !vm.parent ||
            !vm.parent.type ||
            vm.parent.type.name !== COMPONENT_NAME.STEPS
        ) {
            return console.warn(
                `[${COMPONENT_NAME.STEP}] must be a child of ${COMPONENT_NAME.STEPS}`,
            );
        }
        const parent = inject(PROVIDE_KEY);
        const itemDomRef = ref();
        const index = computed(() => {
            const parentDom = parent.parentDomRef.value;
            const itemDom = itemDomRef.value;
            if (parentDom && itemDom) {
                return (
                    Array.from(parentDom.children).indexOf(itemDom) +
                    parent.props.initial
                );
            }
            return parent.props.initial - 1;
        });
        const style = computed(() => {
            const _style = {};
            const parentDom = parent.parentDomRef.value;
            if (parentDom) {
                const lastChild =
                    index.value ===
                    parentDom.children.length - 1 + parent.props.initial;
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
        const renderSymbol = () => {
            const Wrapper = <div class={`${prefixCls}-symbol`}></div>;
            let content;
            if (slots.icon) {
                content = (
                    <span class={`${prefixCls}-icon`}>{slots.icon()}</span>
                );
            } else if (
                status.value === STATUS.WAIT ||
                status.value === STATUS.PROCESS
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
                <Wrapper>
                    <div class={`${prefixCls}-symbol-wrapper`}>{content}</div>
                    {parent.props.vertical && (
                        <div class={`${prefixCls}-tail`}></div>
                    )}
                </Wrapper>
            );
        };
        return () => (
            <div ref={itemDomRef} class={classList.value} style={style.value}>
                {renderSymbol()}
                <div class={`${prefixCls}-content`}>
                    <div class={`${prefixCls}-title`}>
                        {slots.title?.() || props.title}
                        {!parent.props.vertical && (
                            <div class={`${prefixCls}-tail`}></div>
                        )}
                    </div>
                    {(slots.description || props.description) && (
                        <div class={`${prefixCls}-description`}>
                            {slots.description?.() || props.description}
                        </div>
                    )}
                </div>
            </div>
        );
    },
});
