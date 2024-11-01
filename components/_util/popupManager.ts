import { useSessionStorage } from '@vueuse/core';
import { getPrefixStorage } from '../_util/storage';

const INIT_Z_INDEX = 2000;

const zIndex = useSessionStorage<number>(getPrefixStorage('z-index'), INIT_Z_INDEX);
if (zIndex.value < INIT_Z_INDEX) {
    zIndex.value = INIT_Z_INDEX;
}

const PopupManager = {
    zIndex: zIndex.value,
    nextZIndex() {
        ++zIndex.value;
        PopupManager.zIndex = zIndex.value;
        return PopupManager.zIndex;
    },
};

export default PopupManager;
