<template>
    <FSelect multiple :options="optionsRef" remote @search="fetchData">
    </FSelect>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const options = [
            {
                value: 'hear',
                label: '不想听，风叮咛',
            },
            {
                value: 'hand',
                label: '执手踏雪穿行',
            },
            {
                value: 'once',
                label: '善念起 忘了通过的曾经',
            },
            {
                value: 'bell',
                label: '恨铃声 摇不醒',
            },
            {
                value: 'soul',
                label: '美丑难辨的灵魂',
            },
        ];
        const optionsRef = ref([]);
        const fetchData = (query) => {
            if (!query.length) {
                optionsRef.value = [];
                return;
            }
            window.setTimeout(() => {
                optionsRef.value = options.filter(
                    (item) => ~item.label.indexOf(query),
                );
            }, 300);
        };
        return {
            fetchData,
            optionsRef,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
