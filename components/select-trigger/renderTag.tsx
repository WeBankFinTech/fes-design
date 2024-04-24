import {
    type ComponentObjectPropsOptions,
    type PropType,
    type VNodeChild,
    defineComponent,
} from 'vue';

import type { RenderTagParam, SelectOption } from './interface';

export default defineComponent({
    props: {
        option: Object as PropType<SelectOption>,
        renderTag: Function as PropType<(param: RenderTagParam) => VNodeChild>,
    } satisfies ComponentObjectPropsOptions,
    emits: ['close'],
    setup(props, { emit, slots }) {
        const handleClose = () => {
            emit('close');
        };
        return () => {
            const { option, renderTag } = props;
            if (renderTag) {
                return renderTag({ option, handleClose });
            }
            return slots.default?.();
        };
    },
});
