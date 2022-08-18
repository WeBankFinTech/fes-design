import { defineComponent, VNodeChild, PropType } from 'vue';

import type { SelectOption, RenderTagParam } from './interface';

export default defineComponent({
    props: {
        option: Object as PropType<SelectOption>,
        renderTag: Function as PropType<(param: RenderTagParam) => VNodeChild>,
    },
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
