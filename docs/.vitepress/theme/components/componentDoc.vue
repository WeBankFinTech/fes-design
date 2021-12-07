<template>
    <div class="component-doc">
        <div class="component-doc-header">
            <LeftOutlined @click="visibleCode = !visibleCode" />
        </div>
        <div class="component-doc-content">
            <slot></slot>
        </div>
        <div :class="['component-doc-code', visibleCode && 'visible-code']">
            <pre v-html="code"></pre>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

import { highlight } from './highlight';
import codes from './demoCode';

export default defineComponent({
    props: {
        code: String
    },
    setup(props) {
        const code = ref('');
        watch(
            () => props.code,
            () => {
                code.value = codes[props.code]
                    ? highlight(codes[props.code], 'vue')
                    : '';
            },
            {
                immediate: true
            }
        );

        const visibleCode = ref(false);
        return {
            visibleCode,
            code
        };
    }
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
        > .fes-design-icon {
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
            opacity: 1;
            height: auto;
            padding: 16px;
        }
    }
}
</style>
