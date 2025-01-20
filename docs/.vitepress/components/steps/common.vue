<template>
    <FSteps :current="current">
        <FStep title="待开始" description="All through the day, I me mine" @clickStep="handleClickStep" />
        <FStep
            title="进行中"
            description="When I find myself in times of trouble Mother Mary comes to me"
            @clickStep="handleClickStep"
        />
        <FStep title="待处理" @clickStep="handleClickStep">
            <template #icon>
                <ProductOutlined />
            </template>
        </FStep>
        <FStep
            title="已完成"
            description="Something in the way she moves Attracts me like no other lover"
            @clickStep="handleClickStep"
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

        const handleClickStep = (step) => {
            console.log('[steps.common] handleClickStep, step:', step);
        };

        return {
            current,
            pre,
            next,
            handleClickStep,
        };
    },
};
</script>
