<template>
    <FSpace vertical>
        <FInput v-model="inputValue" placeholder="请输入" size="small" />
        <FSelect v-model="selectValue" placeholder="请选择" size="small" style="width: 200px">
            <FSelectOption label="选项一" value="1" />
            <FSelectOption label="选项二" value="2" />
            <FSelectOption label="选项三" value="3" />
        </FSelect>
        <FInputNumber v-model="numberValue" size="small" />
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const inputValue = ref('hello');
        const selectValue = ref('');
        const numberValue = ref(1);

        return {
            inputValue,
            selectValue,
            numberValue,
        };
    },
};
</script>