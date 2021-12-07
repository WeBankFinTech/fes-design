<template>
    <FScrollbar ref="scrollbarRef" :height="visibleHeight" noresize>
        <ul ref="root" :class="`${prefixCls}-content-item`" :style="style" @mousedown.prevent @click.stop="selectedTime">
            <li
                v-for="(item, index) in times"
                :key="item.value"
                :data-key="item.value"
                :class="{
                    [`${prefixCls}-content-item-child`]: true,
                    'is-disabled': item.disabled,
                    'is-active': item.value === value,
                    'is-focus': focus === index,
                }"
            >
                {{item.value}}
            </li>
        </ul>
    </FScrollbar>
</template>

<script>
import {
    ref, computed, nextTick, watch, onMounted,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import FScrollbar from '../scrollbar';

const prefixCls = getPrefixCls('time-picker');

export default {
    components: {
        FScrollbar,
    },
    props: {
        visible: Boolean,
        value: {
            type: String,
            default: '',
        },
        focus: {
            type: Number,
            default: -1,
        },
        times: {
            type: Array,
            default() {
                return [];
            },
        },
        visibleCount: {
            type: Number,
            default: 8,
        },
    },
    emits: ['change'],
    setup(props, { emit }) {
        const root = ref(null);
        const itemHeight = 24;
        const scrollbarRef = ref();
        const selectedIndex = computed(() => {
            if (props.value) {
                return props.times.findIndex(item => item.value === props.value);
            }
            return -1;
        });
        const scrollToSelected = (duration) => {
            // move to selected ite
            const rootDom = root.value;
            if (!rootDom) {
                return;
            }
            let index = selectedIndex.value;
            if (index < 0) {
                index = 0;
            }
            const to = rootDom.children[index].offsetTop;
            const firstTop = rootDom.children[0].offsetTop;
            scrollbarRef.value.setScrollTop(to - firstTop, duration);
        };
        watch(selectedIndex, () => {
            nextTick(() => {
                scrollToSelected(120);
            });
        });
        watch(() => props.visible, () => {
            if (props.visible) {
                nextTick(() => {
                    scrollbarRef.value.update();
                    scrollToSelected(0);
                });
            }
        });

        const paddingBottom = computed(() => (props.visibleCount - 1) * itemHeight);

        const scrollToView = (duration) => {
            const index = props.focus;
            const rootDom = root.value;
            if (!rootDom || index < 0) {
                return;
            }
            const scrollTop = rootDom.scrollTop;
            const offsetTop = rootDom.children[index].offsetTop;
            const difference = offsetTop - scrollTop;
            if (difference < 0) {
                scrollbarRef.value.setScrollTop(offsetTop, duration);
            } else if (difference > paddingBottom.value) {
                scrollbarRef.value.setScrollTop(scrollTop + (difference - paddingBottom.value), duration);
            }
        };
        watch(() => props.focus, () => {
            nextTick(() => {
                scrollToView(0);
            });
        });

        const selectedTime = (e) => {
            const key = e.target.getAttribute('data-key');
            const option = props.times.find(item => item.value === key);
            if (option && !option.disabled) {
                emit('change', option);
            }
        };

        onMounted(() => {
            nextTick(() => {
                scrollToSelected(0);
            });
        });

        const visibleHeight = computed(() => props.visibleCount * itemHeight);
        const style = computed(() => ({
            'padding-bottom': `${paddingBottom.value}px`,
        }));

        return {
            visibleHeight,
            style,
            scrollbarRef,
            prefixCls,
            root,
            selectedIndex,
            selectedTime,
        };
    },
};
</script>
