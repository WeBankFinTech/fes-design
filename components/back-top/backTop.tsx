import {
    Transition,
    defineComponent,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { ArrowUpOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import { backTopProps } from './props';
import { useBackTop } from './useBackTop';

const prefixCls = getPrefixCls('back-top');

export default defineComponent({
    name: 'FBackTop',
    props: backTopProps,
    emits: ['click'],
    setup(props, { emit, slots }) {
        useTheme();

        const { visible, handleClick, backTopStyle } = useBackTop(props, emit);

        return () => (
            <Transition name={`${prefixCls}-fade-in`}>
                {visible.value && (
                    <div
                        style={backTopStyle.value}
                        class={`${prefixCls}`}
                        onClick={handleClick}
                    >
                        {
                            slots.default
                                ? slots.default()
                                : <ArrowUpOutlined class={`${prefixCls}-icon`} />
                        }
                    </div>
                )}
            </Transition>
        );
    },
});
