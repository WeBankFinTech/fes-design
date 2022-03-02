<template>
    <FCascader v-model="value1" :options="asyncOptions" @change="handleChange">
    </FCascader>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';

const options = [
    {
        value: '110000',
        label: '北京市',
        children: [
            {
                value: '110100',
                label: '市辖区',
                children: [
                    {
                        value: '110101',
                        label: '东城区',
                    },
                    {
                        value: '110102',
                        label: '西城区',
                    },
                ],
            },
        ],
    },
    {
        value: '130000',
        label: '河北省',
        children: [
            {
                value: '130100',
                label: '石家庄市',
            },
        ],
    },
    {
        value: '140000',
        label: '山西省',
    },
];

const asyncOptions = ref([]);

function handleChange(value) {
    console.log('Cascader || handleChange || value:', value);
}

async function loadAsyncOptions() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(options);
        }, 2000);
    });
}

export default defineComponent({
    setup() {
        const state = reactive({
            value1: '110101',
            valueEmitPath: ['13000', '130200'],
        });

        onMounted(async () => {
            asyncOptions.value = await loadAsyncOptions();

            setTimeout(() => {
                asyncOptions.value[0].children[0].children[0].label =
                    '东城区东城区东城区东城区东城区东城区';
            }, 2000);
        });

        return {
            ...toRefs(state),
            asyncOptions,
            handleChange,
        };
    },
});
</script>

<style scoped>
.fes-cascader {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
