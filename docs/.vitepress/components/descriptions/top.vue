<template>
    <FSpace vertical>
        <FDescriptions title="一二三向前冲" labelPlacement="top">
            <FDescriptionsItem label="墓封">鬼切</FDescriptionsItem>
            <FDescriptionsItem label="墓封">魂镰</FDescriptionsItem>
            <FDescriptionsItem label="墓封">寒钉</FDescriptionsItem>
            <FDescriptionsItem label="吃鸡">MMing</FDescriptionsItem>
            <FDescriptionsItem label="吃鸡">Nannnn</FDescriptionsItem>
            <FDescriptionsItem label="吃鸡">HSmm</FDescriptionsItem>
        </FDescriptions>
    </FSpace>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
    setup() {
        const currentDate = ref(Date.now() + 31 * 24 * 60 * 60 * 1000);
        const change = () => {
            console.log('change:', currentDate.value);
        };

        const style = reactive({
            width: '200px',
        });

        const datetime = ref();

        return {
            currentDate,
            change,
            datetime,
            style,
        };
    },
});
</script>
