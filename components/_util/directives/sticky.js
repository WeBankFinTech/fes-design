import { nextTick } from 'vue';
import sticky from 'stickybits';

const stickyInstanceList = new WeakMap();

function create(el, binding) {
    if (binding.arg) {
        nextTick(() => {
            const stickyInstance = sticky(el, binding.value);
            stickyInstanceList.set(el, stickyInstance);
        });
    }
}

function clean(el) {
    const stickyInstance = stickyInstanceList.get(el);
    if (stickyInstance) {
        stickyInstance.cleanup();
        stickyInstanceList.delete(el);
    }
}

function update(el, binding) {
    const stickyInstance = stickyInstanceList.get(el);
    if (stickyInstance) {
        if (binding.arg) {
            nextTick(() => {
                stickyInstance.update(binding.value);
            });
        } else {
            clean(el);
        }
    } else {
        create(el, binding);
    }
}


export default {
    beforeMount(el, binding) {
        create(el, binding);
    },
    updated(el, binding) {
        update(el, binding);
    },
    unmounted(el) {
        clean(el);
    },
};
