import {
    defineComponent,
    computed,
    resolveComponent,
    h,
    cloneVNode,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { FAvatar } from '../avatar';
import { FTooltip } from '../tooltip';
import { useTheme } from '../_theme/useTheme';
import { avatarGroupProps } from './props';

const prefixCls = getPrefixCls('avatar-group');

export default defineComponent({
    name: 'FAvatarGroup',
    props: avatarGroupProps,
    setup(props, { slots }) {
        useTheme();
        // 渲染option
        const renderAvatarByOption = (num?: number) => {
            const avatarList = props.options.map((avatar, index) => {
                if (num && index + 1 > num) {
                    return null;
                }
                const IconComponent = avatar.icon
                    ? resolveComponent(avatar.icon)
                    : null;
                return (
                    <FTooltip
                        content={avatar.name}
                        placement="top"
                        // 没有name 也不展示
                        disabled={!props.expandOnHover || !avatar.name}
                    >
                        <FAvatar
                            src={avatar.src}
                            size={props.size}
                            shape={props.shape}
                            style={{
                                zIndex: slotsAvatarCount.value
                                    ? slotsAvatarCount.value
                                    : index,
                            }}
                        >
                            {avatar.text}
                            {IconComponent ? h(IconComponent) : null}
                        </FAvatar>
                    </FTooltip>
                );
            });

            return avatarList;
        };

        // 标签的头像个数
        const slotsAvatarCount = computed(() => {
            return slots.default?.().length || 0;
        });

        // option 个数
        const optionAvatarCount = computed(() => {
            return props.options?.length || 0;
        });

        // 计算头像个数，可能插槽传递，可能option传递
        const avatarCount = computed(() => {
            return slotsAvatarCount.value + optionAvatarCount.value;
        });

        // 应该渲染option个数
        const shouldRenderOptionNum = computed(() => {
            const res = props.max - slotsAvatarCount.value;
            return res > 0 ? res : 0;
        });

        // 渲染未展示的option的name信息
        const renderHiddenTooltip = () => {
            const tooltipContent = props.options.map((avatar, index) => {
                if (index >= shouldRenderOptionNum.value && avatar.name) {
                    return <div>{avatar.name}</div>;
                }
                return null;
            });
            return tooltipContent.filter(Boolean);
        };

        // 渲染未展示数
        const renderHiddenAvatar = (num: number) => {
            return (
                <FTooltip
                    placement="top"
                    v-slots={{
                        content: renderHiddenTooltip,
                    }}
                    disabled={
                        !props.expandOnHover || !renderHiddenTooltip().length
                    }
                >
                    <FAvatar
                        size={props.size}
                        shape={props.shape}
                        style={{
                            zIndex: avatarCount.value,
                        }}
                    >
                        +{num}
                    </FAvatar>
                </FTooltip>
            );
        };

        const renderAvatarGroup = () => {
            const slotsContent = slots.default ? slots.default() : [];

            const clonedSlotsContent = slotsContent.map((vNode, index) => {
                // 应用统一的形状和尺寸参数
                return cloneVNode(vNode, {
                    style: { zIndex: index },
                    size: props.size,
                    shape: props.shape,
                });
            });

            // 如果头像总数小于max，则全部渲染
            if (avatarCount.value < props.max) {
                return (
                    <div class={prefixCls}>
                        {clonedSlotsContent}
                        {renderAvatarByOption()}
                    </div>
                );
            } else if (slotsAvatarCount.value >= props.max) {
                // 如果插槽内部 个数都大于max，只渲染插槽前max个,未展示的 以+xx表示
                const limitedSlotsContent = clonedSlotsContent.slice(
                    0,
                    props.max,
                );
                const hiddenNum = avatarCount.value - props.max;
                return (
                    <div class={prefixCls}>
                        {limitedSlotsContent}
                        {hiddenNum != 0 ? renderHiddenAvatar(hiddenNum) : null}
                    </div>
                );
            } else {
                // 渲染全部插槽和部分option，未展示的 以+xx表示
                // 需要渲染option的个数
                // const optionNum = props.max - slotsAvatarCount.value;
                const hiddenNum = avatarCount.value - props.max;
                return (
                    <div class={prefixCls}>
                        {clonedSlotsContent}
                        {renderAvatarByOption(shouldRenderOptionNum.value)}
                        {hiddenNum != 0 ? renderHiddenAvatar(hiddenNum) : null}
                    </div>
                );
            }
        };

        return () => renderAvatarGroup();
    },
});
