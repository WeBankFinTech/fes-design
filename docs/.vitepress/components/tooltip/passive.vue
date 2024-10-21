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
        <FTooltip
            :modelValue="visible"
            mode="confirm"
            :passive="false"
            :confirmOption="{ okText: 'OK' }"
            :content="0"
            @ok="() => handleConfirm('确定')"
            @cancel="() => handleConfirm('取消')"
            @clickOutside="handleClickOutside"
        >
            <FButton type="link" @click="visible = true">删除</FButton>
            <template #title>
                <div style="width: 200px">是否删除当前内容</div>
            </template>
        </FTooltip>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';

const visible = ref(false);
const closeOnClickOutside = ref(true);

function handleConfirm(type) {
    FMessage.info(`点击了${type}`);
    if (type === '确定') {
        visible.value = false;
    }
}
function handleClickOutside() {
    console.log('[tooltip.passive] clickOutside');
    if (closeOnClickOutside.value) {
        visible.value = false;
    }
}
</script>
