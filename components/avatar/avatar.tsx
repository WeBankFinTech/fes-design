import {
    defineComponent,
    computed,
    ref,
    onMounted,
    nextTick,
    onUpdated,
    watch,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { PictureFailOutlined } from '../icon';
import { avatarProps } from './props';
import { sizeMap } from './const';

const prefixCls = getPrefixCls('avatar');

export default defineComponent({
    name: 'FAvatar',
    props: avatarProps,
    emits: ['error'],
    setup(props, { emit, slots }) {
        const avatarCls = computed(() => {
            return [
                `${prefixCls}`,
                props.shape === 'square'
                    ? `${prefixCls}-shape-square`
                    : `${prefixCls}-shape-circle`,
            ];
        });

        const avatarSize = computed(() => {
            return typeof props.size === 'number'
                ? props.size
                : sizeMap[props.size] ?? sizeMap['middle'];
        });

        const avatarStyle = computed(() => {
            return {
                width: `${avatarSize.value}px`,
                height: `${avatarSize.value}px`,
                backgroundColor: props.backgroundColor,
                color: props.color,
            };
        });

        const avatarRef = ref<HTMLElement | null>(null);

        const contentRef = ref<HTMLElement | null>(null);

        // 动态缩放字体
        const adjustFontSize = (
            element: HTMLElement | null,
            contentElement: HTMLElement | null,
        ) => {
            if (!element || !contentElement) return;

            // 计算并设置缩放值
            const parentWidth = element.offsetWidth;
            const contentWidth = contentElement.scrollWidth;
            const scaleVal = (parentWidth * 0.7) / contentWidth; // 始终保持最大宽度的70%，这个数值比较美观
            contentElement.style.transform = 'scale(' + scaleVal + ')';
        };

        // 图片加载失败,且没有兜底图片
        const imgLoadingFailed = ref(false);

        // 设定图片如何在容器中展示
        const imgStyle = computed(() => {
            return {
                objectFit: props.fit,
            };
        });

        // 渲染头像图片
        const renderImg = () => {
            let fallbackAttempted = false;

            // img 加载出错回调
            const handleError = (event: Event) => {
                if (props.fallbackSrc && !fallbackAttempted) {
                    // 替换成错误场景的图片路径
                    (event.target as HTMLImageElement).src = props.fallbackSrc;
                    fallbackAttempted = true;
                } else {
                    imgLoadingFailed.value = true;
                }

                // 调用外部传进来的error回调
                emit('error');
            };

            return (
                <img
                    src={props.src}
                    style={imgStyle.value}
                    onError={handleError}
                />
            );
        };

        watch(
            () => props.src,
            () => {
                imgLoadingFailed.value = false;
            },
        );

        onMounted(async () => {
            await nextTick();
            adjustFontSize(avatarRef.value, contentRef.value); // 在组件挂载后调整字体大小
        });

        onUpdated(async () => {
            await nextTick();
            adjustFontSize(avatarRef.value, contentRef.value);
        });

        return () => (
            <div
                ref={avatarRef}
                class={avatarCls.value}
                style={avatarStyle.value}
            >
                <div ref={contentRef} class={`${prefixCls}-content`}>
                    {slots.default?.()}
                </div>
                {props.src ? (
                    imgLoadingFailed.value ? (
                        // 图片加载失败,且没有兜底图片
                        <PictureFailOutlined />
                    ) : (
                        renderImg()
                    )
                ) : null}
            </div>
        );
    },
});
