import {
    type ComponentObjectPropsOptions,
    computed,
    defineComponent,
    inject,
} from 'vue';
import { throttle } from 'lodash-es';
import { provideKey } from './const';
import type { CarouselItemData } from './interface';

const INDICATOR_MOUSE_EVENT = 'mouseOperate'; // 与使用处 jsx 中的 camelCase 对应，不使用 kebab-case
export default defineComponent({
    name: 'FCarouselIndicator',
    props: {
        trigger: {
            type: String,
            default: 'click',
        },
        activeIndex: Number,
        position: String,
        placement: String,
        indicatorType: String,
        type: String,
    } satisfies ComponentObjectPropsOptions,
    emits: [INDICATOR_MOUSE_EVENT],
    setup(props, { emit }) {
        const { prefixCls, slideChildren } = inject(provideKey);

        const indicatorsClass = computed(() => {
            const classes = [
                `${prefixCls}-indicators`,
                `${prefixCls}-indicators-${props.placement}`,
            ];
            if (props.position === 'outside' || props.type === 'card') {
                classes.push(`${prefixCls}-indicators-outside`);
            }
            return classes;
        });

        const onClickIndicator = (index: number, event: MouseEvent) => {
            event.stopPropagation();
            emit(INDICATOR_MOUSE_EVENT, index, event);
        };

        const onHoverIndicator = (index: number, event: MouseEvent) => {
            if (props.trigger === 'hover' && index !== props.activeIndex) {
                emit(INDICATOR_MOUSE_EVENT, index, event);
            }
        };

        const throttledIndicatorHover = throttle((index, event) => {
            event.stopPropagation();
            onHoverIndicator(index, event);
        }, 300);

        return () => (
            <div class={indicatorsClass.value}>
                {slideChildren.value.map(
                    (item: CarouselItemData, index: number) => (
                        <div
                            key={index}
                            class={[
                                `${prefixCls}-indicator`,
                                `${prefixCls}-indicator-${props.indicatorType}`,
                                props.activeIndex === index ? 'is-active' : '',
                            ]}
                            onMouseenter={(e) =>
                                throttledIndicatorHover(index, e)
                            }
                            onClick={(e) => onClickIndicator(index, e)}
                        >
                            <button
                                type="button"
                                class={`${prefixCls}-indicator-btn`}
                            ></button>
                        </div>
                    ),
                )}
            </div>
        );
    },
});
