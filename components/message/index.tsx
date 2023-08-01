import { reactive, Component } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { createManager } from '../_util/noticeManager';
import Alert from '../alert/alert';
import PopupManager from '../_util/popupManager';

import type { Notice, NoticeManagerInst } from '../_util/noticeManager';

const prefixCls = getPrefixCls('message');

type MessageType = 'info' | 'success' | 'warning' | 'error';

type Options = {
    type?: MessageType;
    duration: number;
    getContainer?: () => HTMLElement;
    maxCount?: number;
    top?: string;
    colorful?: boolean;
    content?: string;
    afterClose?: () => void;
    closable?: boolean;
    icon?: () => Component;
};

const defaultConfig = {
    duration: 3,
    getContainer: () => document.body,
    top: '24px',
    colorful: false,
};
let mergeConfig: Options = defaultConfig;

let messageInstance: NoticeManagerInst | null = null;
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
}: Partial<Options>) {
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

    // eslint-disable-next-line prefer-const
    let item: Notice;
    function handleCloseClick() {
        messageInstance!.remove(item?.key);
    }

    const contentIsFunc = typeof content === 'function';
    const iconIsFunc = typeof icon === 'function';
    const scopedSlots: any = {
        default: contentIsFunc ? content : null,
        icon: iconIsFunc ? icon : null,
    };
    item = messageInstance.append({
        afterRemove: afterClose,
        duration:
            duration != null && duration >= 0 ? duration : mergeConfig.duration,
        style: {
            zIndex: PopupManager.nextZIndex(),
        },
        children: (
            <div class={`${prefixCls}-item`}>
                <Alert
                    class={classNames}
                    type={type}
                    message={contentIsFunc ? '' : content}
                    showIcon
                    closable={closable}
                    onClose={handleCloseClick}
                    v-slots={scopedSlots}
                />
            </div>
        ),
    });
}

// function message(type: MessageType, content: string, duration?: number): void;
// function message(type: MessageType, options: Options): void;
function message(
    type: MessageType,
    options: string | Partial<Options>,
    duration?: number,
): void {
    const params: Partial<Options> = { type };
    if (typeof options === 'string') {
        params.content = options;
        params.duration = duration;
    } else {
        Object.assign(params, options);
    }
    create(params);
}

export const FMessage = {
    config(options: Partial<Options>) {
        if (options) {
            mergeConfig = {
                ...defaultConfig,
                ...options,
            };
        }
    },
    info: (content: string | Partial<Options>, duration?: number) =>
        message('info', content, duration),
    success: (content: string | Partial<Options>, duration?: number) =>
        message('success', content, duration),
    warning: (content: string | Partial<Options>, duration?: number) =>
        message('warning', content, duration),
    warn: (content: string | Partial<Options>, duration?: number) =>
        message('warning', content, duration),
    error: (content: string | Partial<Options>, duration?: number) =>
        message('error', content, duration),
    destroy() {
        if (messageInstance) {
            messageInstance.destroy();
        }
        messageInstance = null;
    },
};

export default FMessage;
