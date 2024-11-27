<template>
    <FConfigProvider>
        <FSpace>
            <FButton type="info"> Info </FButton>
            <FButton type="success"> Success</FButton>
            <FButton type="warning"> Warning </FButton>
            <FButton type="danger"> Danger </FButton>
        </FSpace>

        <FDivider />

        <div :ref="(el) => containerSub = el">
            <FConfigProvider :getContainer="getContainerSub" :themeOverrides="themeOverrides">
                <FSpace>
                    <FButton type="info"> Info </FButton>
                    <FButton type="success"> Success</FButton>
                    <FButton type="warning"> Warning </FButton>
                    <FButton type="danger"> Danger </FButton>
                </FSpace>
            </FConfigProvider>
        </div>
    </FConfigProvider>
</template>

<script setup>
import { FDivider } from '@fesjs/fes-design';
import { ref } from 'vue';

const containerSub = ref(null);

const getContainerSub = () => {
    return containerSub.value;
};

const themeOverrides = ref({
    common: {
        fontColorBase: '#606266',
        primaryColor: '#679a4d',
        successColor: '#67c23a',
        dangerColor: '#d32323',
        warningColor: '#cf9847',
    },
});
</script>

<style scoped></style>
