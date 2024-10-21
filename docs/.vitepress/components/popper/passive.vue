<template>
    <FSpace>
        <FForm :labelWidth="150">
            <FFormItem label="是否显示:">
                <FRadioGroup
                    v-model="visible"
                    :cancelable="false"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                    @change="
                        (value) => {
                            console.log(value);
                        }
                    "
                />
            </FFormItem>
            <FFormItem label="点击空白处是否关闭:">
                <FRadioGroup
                    v-model="closeOnClickOutside"
                    :cancelable="false"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                    @change="
                        (value) => {
                            console.log(value);
                        }
                    "
                />
            </FFormItem>
        </FForm>
    </FSpace>

    <FDivider />

    <FSpace>
        <FPopper
            :modelValue="visible"
            placement="bottom"
            trigger="click"
            :arrow="true"
            :passive="false"
            @clickOutside="handleClickOutside"
        >
            <template #trigger>
                <FButton @click="visible = true">Click to activate</FButton>
            </template>
            <div style="padding: 30px">this is content, this is content, this is content</div>
        </FPopper>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const closeOnClickOutside = ref(true);

function handleClickOutside() {
    console.log('[tooltip.passive] clickOutside');
    if (closeOnClickOutside.value) {
        visible.value = false;
    }
}
</script>
