<template>
    <div class="vp-doc">
        <h1>看起来我们进入了错误的链接</h1>
        <p>
            你发现了一个 404 链接:
            <span class="not-found-path">{{ route.path }}</span>
            <br />
            <span v-if="theme.repo">
                Please
                <a :href="`https://github.com/${theme.repo}`" target="_blank">
                    let us know
                </a>
                so we can fix it.
            </span>
        </p>
    </div>
</template>

<script setup>
import { useData, useRoute } from 'vitepress';

const { theme } = useData();
const route = useRoute();
</script>

<style scoped>
.vp-doc {
    padding: 32px 48px;
    background-color: var(--vt-c-bg-soft);
    margin: 32px;
    border-radius: 8px;
}

.not-found-path {
    font-family: var(--vt-font-family-mono);
    color: var(--vt-c-text-code);
}
</style>
