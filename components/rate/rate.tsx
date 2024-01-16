import { defineComponent, computed, ref, watch } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { rateProps, type RateItem } from './props';
import { sizeMap, defaultColorMap } from './const';
import Star from './svg/star.vue';
import LineStar from './svg/line-star.vue';

const prefixCls = getPrefixCls('rate');

export default defineComponent({
    name: 'FRate',
    components: {
        Star,
        LineStar,
    },
    props: rateProps,
    setup(props, { emit, slots }) {
        const rateItemArr = ref<RateItem[]>([]);

        const isHover = ref(false);

        // 根据props 生成评分数组
        const getRateArr = () => {
            const res: RateItem[] = [];
            // 向下取整是满星数 Math.floor(null) 为 0
            const fullStarsNum = Math.floor(props.value);
            // 半星数最多为1
            const halfStar = props.value
                ? Math.floor(props.value) === props.value
                    ? 0
                    : 1
                : 0;

            const emptyStarsNum = props.count - fullStarsNum - halfStar;
            fullStarsNum &&
                [...Array(fullStarsNum)].map(() => {
                    res.push({
                        active: true,
                        hover: true,
                    });
                });
            // 存在半星情况
            if (halfStar) {
                res.push({
                    active: true,
                    hover: true,
                    half: true,
                });
            }

            if (emptyStarsNum >= 0) {
                [...Array(emptyStarsNum)].map(() => {
                    res.push({
                        active: false,
                    });
                });
            }

            rateItemArr.value = res;
        };

        const clearRate = () => {
            rateItemArr.value = rateItemArr.value.map(() => {
                return {
                    active: false,
                };
            });
        };

        const curActiveIndex = computed(() => {
            if (!props.half) {
                return props.value - 1;
            } else {
                return Math.ceil(props.value) - 1;
            }
        });

        // 判断是否能取消
        const handleHalfClearable = (isLeft: boolean, index: number) => {
            if (props.clearable && !isLeft && props.value === index + 1) {
                return true;
            }
            // 半星可以取消的场景
            if (props.clearable && isLeft && props.value === index + 0.5) {
                return true;
            }

            return false;
        };

        // 点击事件，点击的第几个，第几个之前的全亮
        const rateClick = (event: MouseEvent, index: number) => {
            const target = event.currentTarget as HTMLElement;
            const halfWidth = target.offsetWidth / 2;
            // 非半星模式不做判断
            const isLeft = props.half ? event.offsetX <= halfWidth : false;
            // 设定 clearable 后，点击当前值对应的图标后值会被设为null。
            if (handleHalfClearable(isLeft, index)) {
                clearRate();
                emit('update:value', null);
                return;
            }

            // 改变value值，改变了value，视图的rateItemArr会自动变更
            emit('update:value', isLeft ? index + 0.5 : index + 1);
        };

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
            [() => props.value, () => props.count],
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
            const emptyIcon = props.lineStyle ? (
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
            // 线性空星样式
            if (props.lineStyle) {
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

        // hover 会改变rate组件的展示，但是只要不点击，鼠标移开后仍然维持原状
        const hoverMove = (event: MouseEvent, curIndex: number) => {
            const target = event.currentTarget as HTMLElement;
            const halfWidth = target.offsetWidth / 2;
            // 非半星模式不做判断
            const isLeft = props.half ? event.offsetX <= halfWidth : false;

            rateItemArr.value.forEach((item, i) => {
                if (i < curIndex) {
                    rateItemArr.value[i] = {
                        ...item,
                        hover: true,
                        half: false,
                    };
                }
                if (i === curIndex) {
                    rateItemArr.value[i] = {
                        ...item,
                        hover: true,
                        half: isLeft,
                    };
                }
                if (i > curIndex) {
                    rateItemArr.value[i] = {
                        ...item,
                        hover: false,
                        half: false,
                    };
                }
            });
        };

        const hoverLeave = () => {
            rateItemArr.value = rateItemArr.value.map((item, index) => {
                if (
                    index === curActiveIndex.value &&
                    Math.floor(props.value) !== props.value
                ) {
                    // 半星场景 hover离开
                    return {
                        ...item,
                        half: true,
                    };
                }
                return {
                    ...item,
                    half: false,
                };
            });
        };

        const containerHoverEnter = () => {
            isHover.value = true;
        };

        const containerHoverLeave = () => {
            isHover.value = false;
        };

        // 渲染hover状态下的item
        const renderItem = (item: RateItem, isHover: boolean) => {
            const judgment = isHover ? item.hover : item.active;
            if (judgment && item.half) {
                return renderHalfStar();
            }

            if (judgment && !item.half) {
                return renderFullStar();
            }

            return renderEmptyStar();
        };

        // 根据状态渲染
        const renderRateByStatus = (isHover: boolean) => {
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
                                {renderItem(item, isHover)}
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
            return [prefixCls, `${prefixCls}-${props.size}`];
        });

        return () => (
            <div class={containerClass.value}>
                {renderRateByStatus(isHover.value)}
                {renderText()}
            </div>
        );
    },
});
