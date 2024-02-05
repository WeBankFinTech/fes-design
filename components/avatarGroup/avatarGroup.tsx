import { defineComponent, computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { FAvatar } from '../avatar';
import { avatarGroupProps } from './props';

const prefixCls = getPrefixCls('avatar-group');

export default defineComponent({
    name: 'FAvatarGroup',
    props: avatarGroupProps,
    emits: ['error'],
    setup(props, { slots }) {
        // 渲染option
        const renderAvatarByOption = () => {
            const avatarList = props.options.map((avatar) => {
                return <FAvatar src={avatar.src} size={props.size}></FAvatar>;
            });

            return avatarList;
        };

        const slotsAvatarCount = computed(() => {
            return slots.default?.().length || 0;
        });

        const optionAvatarCount = computed(() => {
            return props.options?.length || 0;
        });

        // 计算头像个数，可能插槽传递，可能option传递
        const avatarCount = computed(() => {
            return slotsAvatarCount.value + optionAvatarCount.value;
        });

        const renderAvatarGroup = () => {
            const slotsContent = slots.default ? slots.default() : [];
            // 如果头像总数小于max，则全部渲染
            if (avatarCount.value < props.max) {
                return (
                    <div class={prefixCls}>
                        {slotsContent}
                        {renderAvatarByOption()}
                    </div>
                );
            } else if (slotsAvatarCount.value > props.max) {
                // 如果插槽内部 个数都大于max，只渲染插槽前max个,未展示的 以+xx表示
                const limitedSlotsContent = slotsContent.slice(0, props.max);
                return <div class={prefixCls}>{limitedSlotsContent}</div>;
            } else {
                // 渲染全部插槽和部分option，未展示的 以+xx表示
            }
        };

        return () => renderAvatarGroup();
    },
});
