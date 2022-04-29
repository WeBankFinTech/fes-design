<template>
    <FForm :labelWidth="160">
        <FFormItem label="禁用选项：">
            <FRadioGroup v-model="disabledOption">
                <FRadio value="parent">仅父节点</FRadio>
                <FRadio value="leaf">仅叶子节点</FRadio>
                <FRadio value="specific">指定项</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FCascader :data="data" checkable></FCascader>
</template>
<script>
import { ref, computed } from 'vue';
import { cloneDeep } from 'lodash-es';

function createData(level = 1, baseKey = '') {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = '' + baseKey + level + index;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key),
        };
    });
}
function createLabel(level) {
    if (level === 4) return '道生一';
    if (level === 3) return '一生二';
    if (level === 2) return '二生三';
    if (level === 1) return '三生万物';
}

function flatNodes(nodes = []) {
    return nodes.reduce((res, node) => {
        res.push(node);
        if (node.children && node.children.length) {
            res = res.concat(flatNodes(node.children));
        }
        return res;
    }, []);
}

export default {
    setup() {
        const originData = createData(4);
        const disabledOption = ref('parent');
        const data = computed(() => {
            let data = cloneDeep(originData);
            const allNodes = flatNodes(data);
            if (disabledOption.value === 'specific') {
                data.forEach((item) => {
                    item.disabled = true;
                });
            } else if (disabledOption.value === 'parent') {
                allNodes.forEach((item) => {
                    item.children &&
                        item.children.length &&
                        (item.disabled = true);
                });
            } else if (disabledOption.value === 'leaf') {
                allNodes.forEach((item) => {
                    !(item.children && item.children.length) &&
                        (item.disabled = true);
                });
            }

            return data;
        });
        return {
            data,
            disabledOption,
        };
    },
};
</script>
