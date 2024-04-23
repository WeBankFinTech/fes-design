import { computed, defineComponent, watch } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { StarFilled, StarOutlined } from '../icon';
import { type RateItem, rateProps } from './props';
import { sizeMap } from './const';
import { useRate } from './useRate';

const prefixCls = getPrefixCls('rate');

export default defineComponent({
    name: 'FRate',
    props: rateProps,
    emits: ['update:modelValue', 'change', 'clear'],
    setup(props, { emit, slots }) {
        const {
            rateItemArr,
            isHover,
            curActiveIndex,
            getRateArr,
            rateClick,
            hoverLeave,
            hoverMove,
        } = useRate(props, emit);

        useTheme();

        const getCommonStyle = () => {
            return {
                cursor: props.readonly && 'auto',
                height: `${sizeMap[props.size]}px`,
            };
        };

        // 只读状态改变鼠标样式
        const iconStyle = computed(() => {
            return {
                ...getCommonStyle(),
                color: props.color,
            };
        });

        const emptyIconStyle = computed(() => {
            return {
                ...getCommonStyle(),
            };
        });

        // icon尺寸
        const iconSize = computed(() => {
            return sizeMap[props.size];
        });

        watch(
            () => props.count,
            () => {
                getRateArr();
            },
            {
                immediate: true,
            },
        );

        const emptyIcon = () => {
            return !props.colorFilled
                ? (
                    <StarOutlined size={iconSize.value}></StarOutlined>
                    )
                : slots?.content
                    ? (
                            slots?.content({
                                size: iconSize.value,
                            })
                        )
                    : (
                        <StarFilled size={iconSize.value} />
                        );
        };

        // 渲染满星
        const renderFullStar = () => {
            return (
                <div class="rate-icon full-icon" style={iconStyle.value}>
                    {slots?.content
                        ? (
                                slots?.content({
                                    size: iconSize.value,
                                })
                            )
                        : (
                            <StarFilled size={iconSize.value} />
                            )}
                </div>
            );
        };

        // 渲染半星
        const renderHalfStar = () => {
            return (
                <div class="rate-icon full-icon" style={iconStyle.value}>
                    <div class="background-icon"> {emptyIcon()}</div>
                    <div class="half-icon">
                        {slots?.content
                            ? (
                                    slots?.content({
                                        size: iconSize.value,
                                    })
                                )
                            : (
                                <StarFilled size={iconSize.value} />
                                )}
                    </div>
                </div>
            );
        };

        // 渲染空星
        const renderEmptyStar = () => {
            return (
                <div class="rate-icon empty-icon" style={emptyIconStyle.value}>
                    {emptyIcon()}
                </div>
            );
        };

        const containerHoverEnter = () => {
            isHover.value = true;
        };

        const containerHoverLeave = () => {
            isHover.value = false;
        };

        // 渲染item
        const renderItem = (item: RateItem) => {
            let judgment: boolean;

            // 非只读状态下，如果是hover状态就只看hover属性的boolean确认高亮效果
            if (isHover.value && !props.readonly) {
                judgment = item.hover;
            } else {
                judgment = item.active;
            }
            if (judgment && item.half) {
                return renderHalfStar();
            }

            if (judgment && !item.half) {
                return renderFullStar();
            }
            return renderEmptyStar();
        };

        // 根据状态渲染
        const renderRateByStatus = () => {
            return (
                <div
                    class={`${prefixCls}-container`}
                    onMouseenter={() => containerHoverEnter()}
                    onMouseleave={() => containerHoverLeave()}
                >
                    {rateItemArr.value.map((item, index) => {
                        return (
                            <div
                                onClick={(event) =>
                                    !props.readonly && rateClick(event, index)
                                }
                                onMousemove={(event) =>
                                    !props.readonly && hoverMove(event, index)
                                }
                                onMouseleave={() =>
                                    !props.readonly && hoverLeave()
                                }
                            >
                                {renderItem(item)}
                            </div>
                        );
                    })}
                </div>
            );
        };

        // 获取当前星级对应的文字
        const getCurrentText = () => {
            return props.texts[curActiveIndex.value];
        };

        // 渲染文字
        const renderText = () => {
            if (!props.showText) {
                return null;
            }
            return <div class={`${prefixCls}-text`}>{getCurrentText()}</div>;
        };

        // 容器样式
        const containerClass = computed(() => {
            return [prefixCls, `${prefixCls}-size-${props.size}`];
        });

        return () => (
            <div class={containerClass.value}>
                {renderRateByStatus()}
                {renderText()}
            </div>
        );
    },
});
