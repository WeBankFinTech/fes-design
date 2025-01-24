<template>
    <FForm labelWidth="150px">
        <FFormItem label="尺寸:">
            <FRadioGroup
                v-model="size"
                :options="[
                    { label: 'small(默认)', value: 'small' },
                    { label: 'middle', value: 'middle' },
                    { label: 'large', value: 'large' },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace vertical>
        <FDescriptions title="一二三向前冲" :size="size">
            <FDescriptionsItem label="墓封"> 鬼切 </FDescriptionsItem>
            <FDescriptionsItem label="墓封">魂镰</FDescriptionsItem>
            <FDescriptionsItem label="墓封">寒钉</FDescriptionsItem>
            <FDescriptionsItem label="吃鸡">MMing</FDescriptionsItem>
            <FDescriptionsItem label="吃鸡">Nannnn</FDescriptionsItem>
            <FDescriptionsItem label="吃鸡">HSmm</FDescriptionsItem>
        </FDescriptions>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref('small');
</script>
