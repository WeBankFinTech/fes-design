<template>
    <Space>
        <FTooltip
            mode="confirm"
            @ok="() => handleConfirm('确定')"
            @cancel="() => handleConfirm('取消')"
        >
            <FButton type="link">删除</FButton>
            <template #title>
                <div style="width: 200px">是否删除当前内容</div>
            </template>
        </FTooltip>
    </Space>
</template>

<script>
import { FMessage } from 'fes-design';

export default {
    setup() {
        function handleConfirm(type) {
            FMessage.info(`点击了${type}`);
        }
        return {
            handleConfirm
        };
    }
};
</script>
