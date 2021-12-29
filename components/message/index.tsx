import { reactive, Component } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { createManager } from '../_util/noticeManager';
import Alert from '../alert/alert';
import { getConfig } from '../config-provider';
import PopupManager from '../_util/popupManager';

const prefixCls = getPrefixCls('message');

type MessageType = 'info' | 'success' | 'warning' | 'error';

type Options = {
    type?: MessageType;
    duration?: number;
    getContainer?: () => HTMLElement;
    maxCount?: number;
    top?: string;
    colorful?: boolean;
    content?: string;
    afterClose?: () => void;
    closable?: boolean;
    icon?: () => Component
};


const defaultConfig = {
    duration: 3,
    getContainer: () => {
        const config = getConfig();
        return config.getContainer();
    },
    maxCount: null,
    top: '24px',
    colorful: false,
};
let mergeConfig: Options = defaultConfig;

let messageInstance = null;
const managerStyle = reactive({
    zIndex: 0,
    top: mergeConfig.top,
});

async function create({
    type,
    content,
    duration,
    icon,
    closable,
    afterClose,
    colorful,
}: Options) {
    managerStyle.zIndex = PopupManager.nextZIndex();
    if (!messageInstance?.exited?.()) {
        messageInstance = await createManager({
            getContainer: mergeConfig.getContainer,
            transitionName: `${prefixCls}`,
            class: `${prefixCls}-wrapper`,
            maxCount: mergeConfig.maxCount,
            style: managerStyle,
        });
    }

    const classNames = [`${prefixCls}`];
    // 当前colorful判断优先
    if (!(colorful || (colorful !== false && mergeConfig.colorful))) {
        classNames.push(`${prefixCls}-no-colorful`);
    }
    if (closable) classNames.push(`${prefixCls}-close`);

    let item;
    function handleCloseClick() {
        messageInstance.remove(item?.key);
    }

    const contentIsFunc = typeof content === 'function';
    const iconIsFunc = typeof icon === 'function';
    const scopedSlots = {
        default: contentIsFunc ? content : null,
        icon: iconIsFunc ? icon : null,
    };
    item = messageInstance.append({
        afterRemove: afterClose,
        duration: duration >= 0 ? duration : mergeConfig.duration,
        style: {
            zIndex: PopupManager.nextZIndex(),
        },
        children: (
            <Alert
                class={classNames}
                type={type}
                message={contentIsFunc ? '' : content}
                showIcon
                closable={closable}
                onClose={handleCloseClick}
                v-slots={scopedSlots}
            />
        ),
    });
}

// function message(type: MessageType, content: string, duration?: number): void;
// function message(type: MessageType, options: Options): void;
function message(type: MessageType, options: string | Options, duration?: number): void {
    const params: Options = { type };
    if (typeof options === 'string') {
        params.content = options;
        params.duration = duration || 0;
    } else {
        Object.assign(params, options);
    }
    create(params)
}

export default {
    config(options: Options) {
        if (options) {
            mergeConfig = {
                ...defaultConfig,
                ...options,
            };
        }
    },
    info: (content: string | Options, duration?: number) => message('info', content, duration),
    success: (content: string | Options, duration?: number) => message('success', content, duration),
    warning: (content: string | Options, duration?: number) => message('warning', content, duration),
    warn: (content: string | Options, duration?: number) => message('warning', content, duration),
    error: (content: string | Options, duration?: number) => message('error', content, duration),
    destroy() {
        messageInstance && messageInstance.destroy();
        messageInstance = null;
    },
};
