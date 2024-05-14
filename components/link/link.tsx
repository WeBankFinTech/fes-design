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

        const linkClassList = computed(() => {
            const clsList = [`${prefixCls}-content`,
                 `${prefixCls}-content-type-${props.type}`,
                 `${prefixCls}-content-size-${props.size}`,
            ];
            props.disabled && clsList.push(`${prefixCls}-content-disabled`);
            props.underline && clsList.push('underline');
            return clsList;
        });

        const renderLink = () => {
            return (
                <a href={props.href} target={props.target} class={linkClassList.value}>
                    {slots.icon ? (<div class="icon"> {slots.icon()}</div>) : null}
                    <div>{slots.default?.()}</div>
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
