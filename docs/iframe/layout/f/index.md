<Demo />

<script>
import Demo from './index.vue'
import {hideLayout} from '../../../.vitepress/theme/utils';

export default {
    components: {
        Demo
    },
    setup() {
        hideLayout();
    }
}
</script>
