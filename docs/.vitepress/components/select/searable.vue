<template>
    <space>
        <FSelect :fetchData="fetchData"> </FSelect>
    </space>
</template>
<script>
import { reactive } from 'vue';

export default {
    setup() {
        const optionList = [
            {
                value: 'hear',
                label: '不想听，风叮咛',
            },
            {
                value: 'hand',
                label: '执手踏雪穿行',
                disabled: true,
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
        const defaultOption = [
            {
                value: 'demon1',
                label: '百妖谱1',
            },
            {
                value: 'demon2',
                label: '百妖谱2',
            },
        ];
        const fetchData = (inputText) => {
            if (!inputText) return [];
            return optionList.filter(
                (item) => item.label.indexOf(inputText) !== -1,
            );
        };
        return {
            fetchData,
            defaultOption,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
