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

        <FTooltip
            mode="confirm"
            :confirmOption="{ okText: 'OK' }"
            :content="0"
            @ok="() => handleConfirm('确定')"
            @cancel="() => handleConfirm('取消')"
        >
            <svg
                style="margin-top: 8px; cursor: pointer;"
                width="16"
                height="16"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M704 96.768a21.333 21.333 0 0 1 21.333 21.333V251.18h181.334A21.333 21.333 0 0 1 928 272.512v21.333a21.333 21.333 0 0 1-21.333 21.334h-87.851l-23.381 612.778H227.54L204.46 315.18h-87.126A21.333 21.333 0 0 1 96 293.845v-21.333a21.333 21.333 0 0 1 21.333-21.333h181.334v-133.12A21.333 21.333 0 0 1 320 96.725h384zm29.824 767.147 20.992-548.736H268.544l20.65 548.778h444.63zM442.667 432.043A21.333 21.333 0 0 1 464 453.376v271.787a21.333 21.333 0 0 1-21.333 21.333h-21.334A21.333 21.333 0 0 1 400 725.163V453.376a21.333 21.333 0 0 1 21.333-21.333h21.334zm160 0A21.333 21.333 0 0 1 624 453.376v271.787a21.333 21.333 0 0 1-21.333 21.333h-21.334A21.333 21.333 0 0 1 560 725.163V453.376a21.333 21.333 0 0 1 21.333-21.333h21.334zm58.624-271.275H362.624v90.453h298.667v-90.453z" />
            </svg>
            <template #title>
                <div style="width: 200px">是否删除当前内容</div>
            </template>
        </FTooltip>
    </FSpace>
</template>

<script>
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
