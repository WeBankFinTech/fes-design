<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="是否显示:">
                <FRadioGroup
                    v-model="visible"
                    :cancelable="false"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                />
            </FFormItem>
        </FForm>
    </FSpace>

    <FDivider />

    <FPopper v-model="visible" placement="bottom" trigger="click" :arrow="true" :popperStyle="{ zIndex: 1500 }">
        <template #trigger>
            <FButton>Click to activate</FButton>
        </template>
        <div style="padding: 30px">this is content, this is content, this is content</div>
    </FPopper>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
</script>

<style scoped></style>
