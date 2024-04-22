import { defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { COMPONENT_NAME } from './constants';
import { sliderProps } from './props';

export const Slider = defineComponent({
    name: COMPONENT_NAME,
    props: sliderProps,
    setup: () => {
        useTheme();

        return () => <div>slider</div>;
    },
});
