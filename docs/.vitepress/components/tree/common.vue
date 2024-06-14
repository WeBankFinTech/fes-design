<template>
    <FGrid>
        <FGridItem :span="12">
            默认为可选中：
            <FTree :data="data1" />
        </FGridItem>
        <FGridItem :span="12">
            选中后无法取消：
            <FTree :data="data2" :cancelable="false" />
        </FGridItem>
    </FGrid>
</template>

<script>
import { h, reactive } from 'vue';
import { PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix = null, suffix = null) {
    if (!level) {
        return undefined;
    }
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key, prefix, suffix),
            prefix: prefix ? () => h(PictureOutlined) : null,
            suffix: suffix ? () => h(PlusCircleOutlined) : null,
        };
    });
}

function createLabel(level) {
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
}

export default {
    setup() {
        const data1 = reactive(createData(3));
        console.log(JSON.stringify(data1, null, 2));
        const data2 = [
            {
                label: '二生三',
                value: '20',
                children: [
                    {
                        label: '三生万物',
                        value: '2010',
                        prefix: null,
                        suffix: null,
                        children: [
                            {
                                label: '三生万物',
                                value: '312010',
                                prefix: null,
                                suffix: null,
                            },
                            {
                                label: '三生万物',
                                value: '312011',
                                prefix: null,
                                suffix: null,
                            },
                        ],
                    },
                    {
                        label: '三生万物',
                        value: '2011',
                        prefix: null,
                        suffix: null,
                    },
                ],
                prefix: null,
                suffix: null,
            },
            {
                label: '二生三',
                value: '21',
                prefix: null,
                suffix: null,
            },
        ];
        return {
            data1,
            data2,
        };
    },
};
</script>
