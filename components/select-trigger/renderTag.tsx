import { h, defineComponent, VNodeChild, PropType } from 'vue';

import { SelectOption, RenderTagParam } from './interface'


export default defineComponent({
    props: {
        option: Object as PropType<SelectOption>,
        renderTag: Function as PropType<(param: RenderTagParam) => VNodeChild>
    },
    emits: ['close'],
    setup(props, {emit, slots}) {
        return () => {
            const { option, renderTag } = props;
            const handleClose = ()=>{
                emit('close')
            }
            if(renderTag) {
                return renderTag({option, handleClose})
            }
            return slots?.default()
        };
    },
});
