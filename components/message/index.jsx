import { isObject } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { createManager } from '../_util/noticeManager';
import Alert from '../alert/alert';
import { getConfig } from '../config-provider';

const prefixCls = getPrefixCls('message');

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
let mergeConfig = defaultConfig;

let messageInstance = null;

async function create({
    type,
    content,
    duration,
    icon,
    closable,
    afterClose,
    colorful,
}) {
    if (!messageInstance) {
        messageInstance = await createManager({
            getContainer: mergeConfig.getContainer,
            transitionName: `${prefixCls}`,
            class: `${prefixCls}-wrapper`,
            maxCount: mergeConfig.maxCount,
            style: {
                top: mergeConfig.top,
            },
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

function apiArgsParse(type, args = []) {
    const params = { type };
    if (isObject(args[0]) && args[0].content) {
        Object.assign(params, args[0]);
    } else {
        params.content = args[0];
        params.duration = args[1];
    }
    return params;
}

export default {
    /**
     * 全局配置
     * @param {{
     *  duration: Number,
     *  getContainer: Function,
     *  maxCount: Number,
     *  top: String,
     *  colorful: Boolean
     * }} options 配置项
     */
    config(options) {
        if (options) {
            mergeConfig = {
                ...defaultConfig,
                ...options,
            };
        }
    },
    info: (...args) => create(apiArgsParse('info', args)),
    success: (...args) => create(apiArgsParse('success', args)),
    warning: (...args) => create(apiArgsParse('warning', args)),
    warn: (...args) => create(apiArgsParse('warning', args)),
    error: (...args) => create(apiArgsParse('error', args)),
    destroy() {
        messageInstance && messageInstance.destroy();
        messageInstance = null;
    },
};
