<template>
    <FSteps :current="current">
        <FStep title="待开始" description="All through the day, I me mine">
        </FStep>
        <FStep
            title="进行中"
            description="When I find myself in times of trouble Mother Mary comes to me"
        />
        <FStep title="待处理">
            <template #icon>
                <ProductOutlined />
            </template>
        </FStep>
        <FStep
            title="已完成"
            description="Something in the way she moves Attracts me like no other lover"
        />
    </FSteps>

    <FSpace>
        <FButton @click="pre">上一步</FButton>
        <FButton @click="next">下一步</FButton>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const current = ref(2);
        const pre = () => {
            if (current.value < 1) {
                return;
            }
            current.value = current.value - 1;
        };
        const next = () => {
            if (current.value > 4) {
                return;
            }
            current.value = current.value + 1;
        };

        return {
            current,
            pre,
            next,
        };
    },
};
</script>
