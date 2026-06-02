import { computed, defineComponent } from 'vue';
import LoadingOutlined from '../icon/LoadingOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { linkProps } from './props';

const prefixCls = getPrefixCls('link');

export default defineComponent({
    name: 'FLink',
    props: linkProps,
    emits: ['click'],
    setup(props, { slots, emit }) {
        useTheme();

        const linkClassList = computed(() => {
            const clsList = [
                `${prefixCls}`,
                `${prefixCls}-type-${props.type}`,
                `${prefixCls}-size-${props.size}`,
            ];
            props.disabled && clsList.push(`is-disabled`);
            props.underline && clsList.push('is-underline');
            props.loading && clsList.push(`${prefixCls}--loading`);
            return clsList;
        });

        function handleClick(event: MouseEvent) {
            if (!props.disabled && !props.loading) {
                emit('click', event);
            }
        }

        return () => (
            <a href={props.href} target={props.target} class={linkClassList.value} onClick={handleClick}>
                {props.loading ? (<LoadingOutlined class={`${prefixCls}-loading-icon`} />) : (slots.icon ? (<div class="icon"> {slots.icon()}</div>) : null)}
                <div>{slots.default?.()}</div>
            </a>
        );
    },
});
