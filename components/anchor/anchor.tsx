import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { anchorEmits, anchorProps } from './props';
import type { AnchorLink, AnchorProps } from './props';

const prefixCls = getPrefixCls('anchor');

export default defineComponent({
    name: 'FAnchor',
    props: anchorProps,
    emits: anchorEmits,
    setup(props, { emit, slots }) {
        useTheme();

        const activeLink = ref(props.currentAnchor);
        const containerEl = ref<HTMLElement | null>(null);

        const flatLinks = computed(() => {
            const result: AnchorLink[] = [];
            const flatten = (links: AnchorLink[]) => {
                links.forEach((link) => {
                    result.push(link);
                    if (link.children?.length) {
                        flatten(link.children);
                    }
                });
            };
            flatten(props.links);
            return result;
        });

        const findAnchorByHref = (href: string): AnchorLink | undefined => {
            return flatLinks.value.find((link) => link.href === href);
        };

        const getTargetTop = (href: string): number => {
            const target = document.querySelector(href);
            if (!target) return 0;
            const rect = target.getBoundingClientRect();
            return rect.top + (containerEl.value?.scrollTop || 0) - props.offsetTop;
        };

        const handleScroll = () => {
            if (!containerEl.value) return;

            const scrollTop = containerEl.value.scrollTop || 0;
            const viewHeight = containerEl.value.clientHeight;

            let currentActive = '';

            for (const link of flatLinks.value) {
                const targetTop = getTargetTop(link.href);
                if (targetTop > 0 && targetTop - scrollTop < viewHeight / 2) {
                    currentActive = link.href;
                }
            }

            if (currentActive !== activeLink.value) {
                activeLink.value = currentActive;
                emit('change', currentActive);
            }
        };

        let scrollListener: (() => void) | null = null;

        const handleClick = (e: MouseEvent, href: string) => {
            e.preventDefault();
            const targetTop = getTargetTop(href);
            containerEl.value?.scrollTo({
                top: targetTop,
                behavior: 'smooth',
            });
            activeLink.value = href;
            emit('click', e, href);
        };

        const init = () => {
            if (props.container instanceof HTMLElement) {
                containerEl.value = props.container;
            } else {
                containerEl.value = document.documentElement;
            }

            if (scrollListener) {
                scrollListener();
            }
            containerEl.value?.addEventListener('scroll', handleScroll);
            scrollListener = () => {
                containerEl.value?.removeEventListener('scroll', handleScroll);
            };
        };

        onMounted(() => {
            init();
        });

        onUnmounted(() => {
            if (scrollListener) {
                scrollListener();
            }
        });

        watch(
            () => props.container,
            () => {
                init();
            },
        );

        const renderLink = (link: AnchorLink, deep = 0): JSX.Element => {
            const isActive = activeLink.value === link.href;
            return (
                <div class={`${prefixCls}-link`} key={link.href}>
                    <a
                        href={link.href}
                        class={[
                            `${prefixCls}-link-title`,
                            isActive ? `${prefixCls}-link-title-active` : '',
                        ]}
                        onClick={(e) => handleClick(e, link.href)}
                    >
                        {link.title}
                    </a>
                    {link.children?.length && (
                        <div class={`${prefixCls}-link-children`}>
                            {link.children.map((child) => renderLink(child, deep + 1))}
                        </div>
                    )}
                </div>
            );
        };

        return () => (
            <div class={`${prefixCls}`}>
                <div class={`${prefixCls}-wrapper`}>
                    {slots.default?.() ||
                        props.links.map((link) => renderLink(link))}
                </div>
            </div>
        );
    },
});