<template>
    <div
        ref="containerRef"
        style="height: 300px; overflow: auto; border: 1px solid #d9d9d9; position: relative;"
    >
        <FAnchor
            :container="containerRef"
            :links="[
                { title: '章节 1', href: '#section-1' },
                { title: '章节 2', href: '#section-2' },
                { title: '章节 3', href: '#section-3' }
            ]"
            :offset-top="20"
        />
        <div id="section-1" style="height: 400px; padding: 20px; background: #f5f5f5;">
            <h3>章节 1</h3>
        </div>
        <div id="section-2" style="height: 400px; padding: 20px; background: #f0f0f0;">
            <h3>章节 2</h3>
        </div>
        <div id="section-3" style="height: 400px; padding: 20px; background: #e5e5e5;">
            <h3>章节 3</h3>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const containerRef = ref(null);
</script>
