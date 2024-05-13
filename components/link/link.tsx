import { computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { linkProps } from './props';

const prefixCls = getPrefixCls('link');

export default defineComponent({
    name: 'FLink',
    props: linkProps,
    setup(props, { slots }) {
        useTheme();

        const linkClass = computed(() => {
            const cls: string[] = [`${prefixCls}-container`,
                 `${prefixCls}-type-${props.type}`,
                 `${prefixCls}-size-${props.size}`,
            ];

            props.disabled && cls.push(`${prefixCls}-container-disabled`);
            props.underline && cls.push('underline');
            return cls;
        });

        const renderLink = () => {
            return (
                <a href={props.href} target={props.target} class={linkClass.value}>
                    {slots.icon ? (<div class="icon"> {slots.icon()}</div>) : null}
                    {slots.default?.()}
                </a>
            );
        };

        return () => (
            <div class={prefixCls}>
                {renderLink()}
            </div>
        );
    },
});
