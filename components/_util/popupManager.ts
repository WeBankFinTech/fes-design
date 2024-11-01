import { useSessionStorage } from '@vueuse/core';
import { getPrefixStorage } from '../_util/storage';

const PopupManager = {
    zIndex: useSessionStorage<number>(getPrefixStorage('zIndex'), 2000),
    nextZIndex() {
        return ++PopupManager.zIndex.value;
    },
};

export default PopupManager;
