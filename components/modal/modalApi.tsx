import { type VNode, type VNodeChild, render } from 'vue';
import { isFunction, isNil, isUndefined } from 'lodash-es';
import Modal from './modal';
import type { ModalType } from './props';

export interface ModalConfig {
    closable?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    title?: string | VNode | (() => VNodeChild);
    content?: string | VNode | (() => VNodeChild);
    footer?: VNode | (() => VNodeChild);
    okText?: string;
    okLoading?: boolean;
    showCancel?: boolean;
    cancelText?: string;
    cancelLoading?: boolean;
    onOk?: (event: MouseEvent) => void | Promise<any>;
    onCancel?: (event: MouseEvent) => void | Promise<any>;
    width?: string | number;
    maxHeight?: string | number;
    top?: string | number;
    verticalCenter?: boolean;
    center?: boolean;
    fullScreen?: boolean;
    contentClass?: string;
    wrapperClass?: string;
    useAnimation?: boolean;
    getContainer?: () => HTMLElement;
}

type VNodeProperty = 'title' | 'content' | 'footer';

const forceProps = {
    maskClosable: false,
    forGlobal: true, // 标记是否API调用
    displayDirective: 'if',
    footer: true,
} as const;

const defaultConfig: ModalConfig = {
    getContainer: () => document.body,
    width: 400,
    closable: false,
    useAnimation: true,
};
let mergeConfig: ModalConfig = defaultConfig;

/**
 * 创建Model
 */
function create(type: ModalType, config: ModalConfig) {
    const div = document.createElement('div');
    const slots: {
        [key: string]: () => VNodeChild | VNode | string;
    } = {};
    const mergeProps: ModalConfig & {
        show: boolean;
    } = {
        ...mergeConfig,
        show: true,
    };
    let cbFuncEnd = false;

    function removeModal() {
        render(null, div);
    }

    function renderModal() {
        const props = {
            ...mergeProps,
            ...forceProps,
            type,
            onAfterLeave: removeModal,
        };
        render(<Modal {...props} v-slots={slots} />, div);
    }

    async function handleCallBack(
        event: MouseEvent,
        cbFunc?: (event: MouseEvent) => void | Promise<any>,
    ) {
        if (cbFuncEnd) {
            return;
        }
        cbFuncEnd = true;
        try {
            if (isFunction(cbFunc)) {
                await cbFunc(event);
            }
            mergeProps.show = false;
            renderModal();
        } catch (error) {}
        cbFuncEnd = false;
    }

    function updateProps(options: ModalConfig) {
        // 更新 props
        Object.assign(mergeProps, options || {});
        if (isUndefined(options.showCancel)) {
            mergeProps.showCancel = type === 'confirm';
        }
        mergeProps.onOk = (event: MouseEvent) =>
            handleCallBack(event, options.onOk);
        mergeProps.onCancel = (event: MouseEvent) =>
            handleCallBack(event, options.onCancel);

        // 更新 slots
        ['title', 'content', 'footer'].forEach((key) => {
            const slot = options[key as VNodeProperty];
            // 如果有slot，则更新
            if (slot) {
                slots[key] = isFunction(slot) ? slot : () => slot;
            }
            // 如果不为空再更新
            if (key === 'content' && !isNil(slots.content)) {
                slots.default = slots.content;
                delete slots.content;
            }
            delete mergeProps[key as VNodeProperty];
        });
    }

    function update(options: ModalConfig) {
        if (mergeProps.show) {
            // 展示时才能更新
            updateProps(options);
            renderModal();
        }
    }

    function destroy() {
        mergeProps.show = false;
        renderModal();
    }

    updateProps(config);
    renderModal();

    return {
        update,
        destroy,
    };
}

export default {
    config(config: Partial<ModalConfig>) {
        if (config) {
            mergeConfig = {
                ...defaultConfig,
                ...config,
            };
        }
    },
    info: (config: ModalConfig) => create('info', config),
    warning: (config: ModalConfig) => create('warning', config),
    warn: (config: ModalConfig) => create('warning', config),
    success: (config: ModalConfig) => create('success', config),
    error: (config: ModalConfig) => create('error', config),
    confirm: (config: ModalConfig) => create('confirm', config),
};
