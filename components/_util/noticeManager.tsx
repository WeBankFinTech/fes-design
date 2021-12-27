/* eslint-disable vue/one-component-per-file */
import {
    h,
    createApp,
    defineComponent,
    onMounted,
    ref,
    TransitionGroup,
    Component,
} from 'vue';
import {
    InfoCircleFilled,
    CloseCircleFilled,
    CheckCircleFilled,
    ExclamationCircleFilled,
} from '../icon';
import { useTheme } from '../_theme/useTheme';

let seed = 0;
const now = Date.now();
function genUid() {
    return `notice_manager_${now}_${seed++}`;
}

const Notification = defineComponent({
    props: {
        maxCount: Number,
        class: String,
        transitionName: String,
        style: Object,
    },
    setup(props) {
        const notices = ref([]);

        function remove(key) {
            const index = notices.value.findIndex((item) => item.key === key);
            const notice = notices.value[index];
            if (notice) {
                notices.value.splice(index, 1);
                notice.afterRemove && notice.afterRemove();
            }
        }

        function append(notice) {
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
        const { notices, class: className, transitionName, style } = this;
        const children = notices.map((notice) => (
            <div key={notice.key}>
                {typeof notice.children === 'function'
                    ? notice.children()
                    : notice.children}
            </div>
        ));
        return (
            <TransitionGroup
                name={transitionName}
                tag="div"
                class={className}
                style={style}
            >
                {children}
            </TransitionGroup>
        );
    },
});

export function createManager(opt = {}) {
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
                const notificationRef = ref(null);
                const instance = {
                    append: (noticeProps) =>
                        notificationRef.value.append(noticeProps),
                    remove: (key) => notificationRef.value.remove(key),
                    destroy() {
                        app.unmount(div);
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

export const iconComponentMap: { [key: string]: Component } = {
    info: InfoCircleFilled,
    success: CheckCircleFilled,
    error: CloseCircleFilled,
    warning: ExclamationCircleFilled,
};
