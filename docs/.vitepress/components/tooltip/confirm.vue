<template>
    <FSpace>
        <FForm :labelWidth="150">
            <FFormItem label="是否显示确认按钮:">
                <FRadioGroup
                    v-model="showOk"
                    :cancelable="false"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
            <FFormItem label="是否显示取消按钮:">
                <FRadioGroup
                    v-model="showCancel"
                    :cancelable="false"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
        </FForm>
    </FSpace>

    <FSpace align="center">
        <FTooltip
            mode="confirm"
            :confirmOption="{ okText: 'OK', showOk, showCancel }"
            :content="0"
            @ok="() => handleConfirm('确定')"
            @cancel="() => handleConfirm('取消')"
        >
            <FButton type="link">删除</FButton>
            <template #title>
                <div style="width: 200px">是否删除当前内容</div>
            </template>
        </FTooltip>

        <FTooltip
            mode="confirm"
            :confirmOption="{ okText: 'OK', showOk, showCancel }"
            :content="0"
            @ok="() => handleConfirm('确定')"
            @cancel="() => handleConfirm('取消')"
        >
            <FButton type="danger">
                <template #icon>
                    <DeleteOutlined />
                </template>
            </FButton>
            <template #title>
                <div style="width: 200px">是否删除当前内容</div>
            </template>
        </FTooltip>
    </FSpace>
</template>

<script>
import { FMessage } from '@fesjs/fes-design';
import { ref } from 'vue';
import { DeleteOutlined } from '@fesjs/fes-design/icon';

export default {
    setup() {
        const showOk = ref(true);
        const showCancel = ref(true);

        function handleConfirm(type) {
            FMessage.info(`点击了${type}`);
        }

        return {
            showOk,
            showCancel,
            handleConfirm,
        };
    },
};
</script>
