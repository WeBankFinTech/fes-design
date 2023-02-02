<template>
    <FSpace>
        <FTooltip
            mode="confirm"
            :confirmOption="{ okText: 'OK' }"
            :content="0"
            @ok="() => handleConfirm('确定')"
            @cancel="() => handleConfirm('取消')"
        >
            <FButton type="link">删除</FButton>
            <template #title>
                <div style="width: 200px">是否删除当前内容</div>
            </template>
        </FTooltip>
    </FSpace>
</template>

<script>
// eslint-disable-next-line import/no-unresolved
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        function handleConfirm(type) {
            FMessage.info(`点击了${type}`);
        }
        return {
            handleConfirm,
        };
    },
};
</script>
