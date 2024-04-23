<template>
    <FForm>
        <FFormItem label="父子关联：">
            <FSwitch v-model="cascade" />
        </FFormItem>
    </FForm>
    <FTree
        :data="data"
        :cascade="cascade"
        :checkable="true"
        :selectable="false"
    />
</template>

<script setup>
import { ref } from 'vue';

const createLabel = (level) => {
    if (level === 4) {
        return '道生一';
    }
    if (level === 3) {
        return '一生二';
    }
    if (level === 2) {
        return '二生三';
    }
    if (level === 1) {
        return '三生万物';
    }
};

const createData = (level = 1, baseKey = '') => {
    if (!level) {
        return undefined;
    }
    return new Array(3).fill(null).map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key),
        };
    });
};

const data = ref(createData(4));
const cascade = ref(true);
</script>
