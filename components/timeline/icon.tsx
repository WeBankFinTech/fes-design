import {
    type ComponentObjectPropsOptions,
    type PropType,
    type VNodeChild,
    computed,
    defineComponent,
} from 'vue';
import { COMPONENT_NAME, ICON_DEFAULT_COLOR } from './const';
import { cls, isPresetIconTypes, isValidRenderResult } from './utils';
import { useCustomIconRegister } from './useCustomIcons';
import type { ComponentInnerProps } from './utilTypes';
import type { TimelineNode, TimelineUnboxSlots as UnboxSlots } from './props';

const iconProps = {
    index: { type: Number, required: true },
    icon: { type: [String, Function] as PropType<TimelineNode['icon']> },
    slotRender: { type: Function as PropType<UnboxSlots['icon']> },
} as const satisfies ComponentObjectPropsOptions;

export default defineComponent({
    name: `${COMPONENT_NAME}Icon`,
    props: iconProps,
    setup: (props: ComponentInnerProps<typeof iconProps>) => {
        const customIcon = computed(() => {
            let customIcon: VNodeChild;
            // prop 的渲染函数优先级高于插槽
            if (props.slotRender) {
                customIcon = props.slotRender({ index: props.index });
            } else if (typeof props.icon === 'function') {
                customIcon = props.icon({ index: props.index });
            }

            // 自定义渲染没有内容时，fallback
            if (!isValidRenderResult(customIcon)) {
                customIcon = undefined;
            }

            return customIcon;
        });

        const isCustom = computed(() => !!customIcon.value);

        const { iconRef } = useCustomIconRegister(props.index, isCustom);

        return () => {
            // 自定义图标
            if (isCustom.value) {
                return (
                    <div
                        ref={iconRef}
                        class={[cls('item-icon'), cls('item-icon-custom')]}
                    >
                        {customIcon.value}
                    </div>
                );
            }

            // 自定义颜色
            if (
                typeof props.icon === 'string' &&
                !isPresetIconTypes(props.icon)
            ) {
                return (
                    <div
                        ref={iconRef}
                        class={cls('item-icon')}
                        style={{ color: props.icon, borderColor: props.icon }}
                    />
                );
            }

            // 预设颜色
            return (
                <div
                    ref={iconRef}
                    class={[
                        cls('item-icon'),
                        cls(`item-icon-${props.icon ?? ICON_DEFAULT_COLOR}`),
                    ]}
                />
            );
        };
    },
});
