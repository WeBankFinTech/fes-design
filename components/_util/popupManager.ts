import { useSessionStorage } from '@vueuse/core';
import type { Ref } from 'vue';
import { getPrefixStorage } from '../_util/storage';

const PopupManager: {
    zIndex: Ref<number>;
    nextZIndex: () => number;
} = {
    zIndex: useSessionStorage<number>(getPrefixStorage('zIndex'), 2000),
    nextZIndex() {
        return ++PopupManager.zIndex.value;
    },
};

export default PopupManager;
