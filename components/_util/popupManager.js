const PopupManager = {
    zIndex: 2000,
    nextZIndex() {
        return ++PopupManager.zIndex;
    },
};

export default PopupManager;
