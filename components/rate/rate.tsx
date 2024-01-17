import { defineComponent, computed, watch } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { rateProps, type RateItem } from './props';
import { sizeMap, defaultColorMap } from './const';
import Star from './svg/star.vue';
import LineStar from './svg/line-star.vue';
import { useRate } from './useRate';

const prefixCls = getPrefixCls('rate');

export default defineComponent({
    name: 'FRate',
    components: {
        Star,
        LineStar,
    },
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

        // 只读状态改变鼠标样式
        const iconStyle = computed(() => {
            return {
                cursor: props.readonly && 'auto',
                height: `${sizeMap[props.size]}px`,
            };
        });

        // 评分图标激活时颜色
        const activeColor = computed(() => {
            return props.color || defaultColorMap['default'];
        });

        // icon尺寸
        const iconSize = computed(() => {
            return sizeMap[props.size];
        });

        watch(
            [() => props.modelValue, () => props.count],
            () => {
                getRateArr();
            },
            {
                immediate: true,
            },
        );

        // 渲染满星
        const renderFullStar = () => {
            return (
                <div class="rate-icon" style={iconStyle.value}>
                    {slots?.content ? (
                        slots?.content({
                            size: iconSize.value,
                            color: activeColor.value,
                        })
                    ) : (
                        <Star size={iconSize.value} color={activeColor.value} />
                    )}
                </div>
            );
        };

        // 渲染半星
        const renderHalfStar = () => {
            const emptyIcon = !props.colorFilled ? (
                <LineStar size={iconSize.value}></LineStar>
            ) : slots?.content ? (
                slots?.content({
                    size: iconSize.value,
                    color: defaultColorMap['empty'],
                })
            ) : (
                <Star size={iconSize.value} color={defaultColorMap['empty']} />
            );

            return (
                <div class="rate-icon" style={iconStyle.value}>
                    <div class="background-icon">{emptyIcon}</div>

                    <div class="half-icon">
                        {slots?.content ? (
                            slots?.content({
                                size: iconSize.value,
                                color: activeColor.value,
                            })
                        ) : (
                            <Star
                                size={iconSize.value}
                                color={activeColor.value}
                            />
                        )}
                    </div>
                </div>
            );
        };

        // 渲染空星
        const renderEmptyStar = () => {
            // 空心样式
            if (!props.colorFilled) {
                return <LineStar size={iconSize.value}></LineStar>;
            }
            return (
                <div class="rate-icon" style={iconStyle.value}>
                    {slots?.content ? (
                        slots?.content({
                            size: iconSize.value,
                            color: defaultColorMap['empty'],
                        })
                    ) : (
                        <Star
                            size={iconSize.value}
                            color={defaultColorMap['empty']}
                        />
                    )}
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
            if (!props.showText) return null;
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
