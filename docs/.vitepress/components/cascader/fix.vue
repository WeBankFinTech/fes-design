<template>
    <FCascader :data="data" checkable></FCascader>
</template>
<script>
import { reactive, h } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { PictureOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix, suffix) {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = '' + baseKey + level + index;
        const children = createData(level - 1, key, prefix, suffix);
        return {
            label: createLabel(level),
            value: key,
            children,
            prefix: prefix ? () => h(PictureOutlined) : null,
            suffix:
                suffix && children && children.length
                    ? () => h('span', null, children.length)
                    : null,
        };
    });
}

function createLabel(level) {
    if (level === 4) return '道生一';
    if (level === 3) return '一生二';
    if (level === 2) return '二生三';
    if (level === 1) return '三生万物';
}

export default {
    setup() {
        const data = reactive(createData(4, '', true, true));

        return {
            data,
        };
    },
};
</script>
