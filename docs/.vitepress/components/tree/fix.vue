<template>
    <FTree :data="data" checkable />
</template>

<script>
import { h, reactive } from 'vue';
import { AppstoreOutlined, PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix, suffix) {
    if (!level) {
        return undefined;
    }
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        return {
            label: () => h('div', {
                class: 'fix-node-content',
            }, [
                createLabel(level),
                h(AppstoreOutlined),
            ]),
            value: key,
            children: createData(level - 1, key, prefix, suffix),
            prefix: prefix ? () => h(PictureOutlined) : null,
            suffix: suffix ? (data) => (data.isHovered ? h(PlusCircleOutlined) : null) : null,
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
        const data = reactive(createData(4, '', true, true));

        return {
            data,
        };
    },
};
</script>

<style>
.fix-node-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    gap: 5px;
}
</style>
