import { isFunction } from 'lodash-es';
import { render } from 'vue';
import Modal from './modal';

/**
 * @typedef { Object } ModalConfig
 * @property { Boolean } closable - 是否显示右上角关闭图标
 * @property { Boolean } mask - 是否显示蒙层
 * @property { Boolean } maskClosable - 点击蒙层是否允许关闭
 * @property { String | VNode | Function  } title - 标题
 * @property { String | VNode | Function  } content - 内容
 * @property { VNode | Function  } footer - 页脚内容
 * @property { String } okText - 确认按钮文字
 * @property { String } cancelText - 取消按钮文字
 * @property { Function } onOk - 点击确定
 * @property { Function } onCancel - 点击遮罩层或右上角叉或取消按钮的回调
 * @property { String | Number } width - 宽度
 * @property { Boolean } center - 标题、内容、按钮居中
 * @property { Function } getContainer - 指定 Modal 挂载的 HTML 节点
 */

/**
 * @typedef { Object } ModalApi
 * @property { function (ModalConfig):string } info - 普通提示
 * @property { function (ModalConfig):string } success - 成功提示
 * @property { function (ModalConfig):string } warn - 警告提示
 * @property { function (ModalConfig):string } warning - 警告提示
 * @property { function (ModalConfig):string } error - 错误提示
 * @property { function (ModalConfig):string } confirm - 确认提示
 */

/**
 * @typedef { 'info' | 'error' ｜ 'success' | 'warning' | 'confirm' } ModalType
 */

const forceProps = {
    closable: false,
    maskClosable: false,
    forGlobal: true,
    displayDirective: 'if',
    footer: true,
};

/**
 * 创建Model
 * @param { ModalType } type 类型
 * @param { ModalConfig } config 配置
 */
function create(type, config) {
    const div = document.createElement('div');
    const slots = {};
    const mergeProps = {
        width: 400,
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

    async function handleCallBack(event, cbFunc) {
        if (cbFuncEnd) return;
        cbFuncEnd = true;
        try {
            if (isFunction(cbFunc)) await cbFunc(event);
            mergeProps.show = false;
            renderModal();
        } catch (error) { }
        cbFuncEnd = false;
    }

    function updateProps(options) {
        // 更新 props
        Object.assign(mergeProps, options || {});
        mergeProps.onOk = (event) => handleCallBack(event, options.onOk);
        mergeProps.onCancel = (event) => handleCallBack(event, options.onCancel);

        // 更新 slots
        ['title', 'content', 'footer'].forEach((key) => {
            const slot = options[key];
            if (slot) {
                slots[key] = isFunction(slot) ? slot : () => slot;
            }
            if (key === 'content') {
                slots.default = slots.content;
                delete slots.content;
            }
            delete mergeProps[key];
        });
    }

    function update(options) {
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

/**
 * Modal全局API
 * @type { ModalApi }
 */
export default {
    info: (config) => create('info', config),
    warning: (config) => create('warning', config),
    warn: (config) => create('warning', config),
    success: (config) => create('success', config),
    error: (config) => create('error', config),
    confirm: (config) => create('confirm', config),
};
