/* eslint-disable vue/one-component-per-file */
import {
    createApp,
    defineComponent,
    onMounted,
    ref,
    TransitionGroup,
    CSSProperties,
    VNodeChild,
    VNode,
    cloneVNode,
} from 'vue';
import {
    InfoCircleFilled,
    CloseCircleFilled,
    CheckCircleFilled,
    ExclamationCircleFilled,
} from '../icon';
import { useTheme } from '../_theme/useTheme';
import { getFirstValidNode } from './vnode';

let seed = 0;
const now = Date.now();
function genUid() {
    return `notice_manager_${now}_${seed++}`;
}

export interface Notice {
    key?: string;
    afterRemove?: () => void;
    duration: number;
    style: CSSProperties;
    children: VNode | (() => VNodeChild);
}

interface NotificationInst {
    remove: (key: string) => void;
    append: (notice: Notice) => Notice;
}

export interface NoticeManagerInst {
    remove: (key: string) => void;
    append: (notice: Notice) => Notice;
    destroy: () => void;
    exited: () => boolean;
}

const Notification = defineComponent({
    props: {
        maxCount: Number,
        transitionName: String,
    },
    setup(props) {
        const notices = ref<Notice[]>([]);

        function remove(key?: string) {
            const index = notices.value.findIndex((item) => item.key === key);
            const notice = notices.value[index];
            if (notice) {
                notices.value.splice(index, 1);
                notice.afterRemove?.();
            }
        }

        function append(notice: Notice) {
            if (!notice.key) notice.key = genUid();
            if (props.maxCount && notices.value.length >= props.maxCount) {
                notices.value.shift();
            }
            notices.value.push(notice);
            if (notice.duration > 0) {
                const timer = setTimeout(() => {
                    remove(notice.key);
                    clearTimeout(timer);
                }, notice.duration * 1000);
            }
            return notice;
        }

        return {
            notices,
            append,
            remove,
        };
    },
    render() {
        const { notices, transitionName } = this;
        const children = notices.map((notice) => {
            let vNode =
                typeof notice.children === 'function'
                    ? notice.children()
                    : notice.children;
            vNode = getFirstValidNode([vNode]);
            if (vNode) return cloneVNode(vNode, { key: notice.key });
        });
        return (
            <TransitionGroup name={transitionName} tag="div">
                {children}
            </TransitionGroup>
        );
    },
});

export function createManager(opt: {
    getContainer?: () => HTMLElement;
    [key: string]: any;
}): Promise<NoticeManagerInst> {
    return new Promise((resolve) => {
        const { getContainer, ...props } = opt;
        const div = document.createElement('div');
        if (getContainer) {
            const root = getContainer();
            root?.appendChild(div);
        } else {
            document.body.appendChild(div);
        }
        const app = createApp({
            setup() {
                useTheme();
                const notificationRef = ref<NotificationInst>();
                const instance = {
                    append: (noticeProps: Notice) =>
                        notificationRef.value!.append(noticeProps),
                    remove: (key: string) => notificationRef.value!.remove(key),
                    destroy() {
                        app.unmount();
                        if (div.parentNode) {
                            div.parentNode.removeChild(div);
                        }
                    },
                    exited() {
                        // 容器是否存在
                        if (!getContainer) return true;
                        try {
                            if (!getContainer()) {
                                instance.destroy();
                                return false;
                            }
                        } catch (error) {
                            instance.destroy();
                            return false;
                        }
                        return true;
                    },
                };
                onMounted(() => resolve(instance));
                return () => <Notification ref={notificationRef} {...props} />;
            },
        });
        app.mount(div);
    });
}

export const iconComponentMap = {
    info: InfoCircleFilled,
    success: CheckCircleFilled,
    error: CloseCircleFilled,
    warning: ExclamationCircleFilled,
};
