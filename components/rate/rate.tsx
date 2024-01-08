import { defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { rateProps } from './props';
import { sizeMap, defaultColorMap } from './const';
import Star from './svg/star.vue';

const prefixCls = getPrefixCls('rate');

export default defineComponent({
    name: 'FRate',
    components: {
        Star,
    },
    props: rateProps,
    setup(props, { slots }) {
        // 渲染评分icon
        const renderRate = () => {
            const fullStarsNum = Math.floor(props.value);
            const emptyStarsNum = props.count - fullStarsNum;
            return (
                <div class={`${prefixCls}-container`}>
                    {[...Array(fullStarsNum)].map(() => (
                        <div class="icon">
                            {slots?.default ? (
                                slots?.default()
                            ) : (
                                <Star
                                    size={sizeMap[props.size]}
                                    color={defaultColorMap['default']}
                                />
                            )}
                        </div>
                    ))}
                    {[...Array(emptyStarsNum)].map(() => (
                        <div class="icon">
                            {slots?.default ? (
                                slots?.default()
                            ) : (
                                <Star
                                    size={sizeMap[props.size]}
                                    color={defaultColorMap['empty']}
                                />
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        return () => <div class={prefixCls}>{renderRate()}</div>;
    },
});
