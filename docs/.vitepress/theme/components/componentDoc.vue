<template>
    <div class="component-doc">
        <div class="component-doc-header">
            <span class="play" @click="openPlayground">play</span>
            <LeftOutlined
                class="show-code-btn"
                :class="[visibleCode && 'active']"
                @click="visibleCode = !visibleCode"
            />
        </div>
        <div class="component-doc-content">
            <slot />
        </div>
        <div
            class="component-doc-code"
            :class="[visibleCode && 'visible-code']"
        >
            <pre v-html="currentCode" />
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { debounce } from 'lodash-es';

import playground from './playground';

export default defineComponent({
    props: {
        codeName: String,
        codeSrc: String,
        codeFormat: String,
    },
    setup(props) {
        const currentCode = computed(() =>
            decodeURIComponent(props.codeFormat),
        );

        const visibleCode = ref(false);
        const openPlayground = debounce(() => {
            playground({
                codeName: props.codeName,
                codeSrc: props.codeSrc,
            });
        }, 500);

        return {
            visibleCode,
            currentCode,
            openPlayground,
        };
    },
});
</script>

<style lang="less">
.component-doc {
    border: 1px solid #cfd0d3;
    border-radius: 4px;

    &-header {
        height: 48px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        border-bottom: 1px solid #cfd0d3;
        font-size: 14px;
        padding: 0 16px;
        .show-code-btn {
            cursor: pointer;
            transition: 0.3s all;
            transform-origin: center center;
            &.active {
                transform: rotateZ(-90deg);
            }
        }
        .play {
            margin-right: 20px;
            cursor: pointer;
        }
    }

    &-content {
        padding: 16px;
    }

    &-code {
        max-height: 720px;
        border-top: 1px solid #cfd0d3;
        transition: all 0.3s;
        opacity: 0;
        height: 0;
        font-size: 14px;
        overflow: auto;

        &.visible-code {
            border-radius: 4px;
            opacity: 1;
            height: auto;
            padding: 16px;
            background-color: #292d3e;
        }
    }
}
</style>
