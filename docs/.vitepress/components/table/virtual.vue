<template>
    <FForm labelWidth="120px">
        <FFormItem v-if="isFixedHeight" label="固定高度：">
            <FInputNumber
                v-model="height"
                :min="50"
                :max="1000"
                :step="50"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="总是显示滚动条：">
            <FRadioGroup
                v-model="alwaysScrollbar"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FTable
        :virtualScroll="virtualScroll"
        :height="650"
        rowKey="index"
        size="small"
        :data="data"
        :columns="cols"
        :alwaysScrollbar="alwaysScrollbar"
        :virtualScrollOption="{
            keeps: 20,
            estimateSize: 40,
        }"
    />
</template>

<script>
import { reactive, ref } from 'vue';

export default {
    setup() {
        const virtualScroll = ref(true);
        const isFixedHeight = ref(true);
        const height = ref(250);
        const alwaysScrollbar = ref(false);

        const createData = (n) => {
            const arr = [];
            for (let i = 0; i < n; i++) {
                arr.push({
                    index: i,
                    workDate: '20250227',
                    architectId: '1',
                    clientId: '00000000080',
                    roleId: '00000000040',
                    mainSessionId: '82d5ddbb-f4dd-11ef-a7f5-5c6f69521b10',
                    intentAutoIncId: 638,
                    stdQuestion: 'Sample Question',
                    isMultiRound: 'yes',
                    custQuestion: 'Sample Customer Question',
                    matchType: 'type1',
                    catalogueId: '00000000000000000000000000000096',
                    interactCnt: 9,
                    isSucc: 'yes',
                    failureParameter: 'None',
                    sceneId: 1,
                    evaluate: 'Good',
                    answer: 'Sample Answer',
                    architectName: '微粒贷',
                    simQuery: 'Sample Query',
                    nluType: 'typeA',
                    modelQuestion: 'Rewritten Question',
                    dmReceiverTime: '15:36:09',
                    originQuestion: 'Original Question',
                    answerName: 'Answer Name',
                });
            }
            return arr;
        };

        const cols = [
            {
                prop: 'index',
                label: '序号',
                width: 80,
                fixed: true,
            },
            {
                prop: 'workDate',
                label: '日期',
                width: 100,
                ellipsis: true,
                formatter: ({ cellValue }) => {
                    return cellValue;
                },

            },
            {
                prop: 'dmReceiverTime',
                label: '时间',
                width: 80,
                ellipsis: true,
            },
            {
                prop: 'architectName',
                label: '进线产品',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'mainSessionId',
                label: '主会话ID',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'stdQuestion',
                label: '命中知识点',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'simQuery',
                label: '命中相似问',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'isMultiRoundText',
                label: '是否多轮',
                width: 80,
                ellipsis: true,
            },
            {
                prop: 'custQuestion',
                label: '客户问法',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'modelQuestion',
                label: '修正问法',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'originQuestion',
                label: '原始问法',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'answerName',
                label: '答案名称',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'answer',
                label: '答案',
                width: 120,
                ellipsis: true,
            },
            {
                prop: 'matchTypeText',
                label: '匹配类型',
                width: 80,
                ellipsis: true,
            },
            {
                prop: 'catalogueName',
                label: '分类',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'cataloguePath',
                label: '知识点路径',
                width: 120,
                ellipsis: true,
            },
            {
                prop: 'interactCnt',
                label: '交互次数',
                width: 80,
                ellipsis: true,
            },
            {
                prop: 'evaluate',
                label: '评论',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'nluType',
                label: '引擎',
                width: 100,
                ellipsis: true,
            },
            {
                prop: 'isSuccText',
                label: '是否成功',
                width: 80,
                ellipsis: true,
            },
            {
                prop: 'failureParameter',
                label: '失败参数',
                width: 100,
                ellipsis: true,
            },
        ];
        return {
            data: createData(10000),
            cols,
            virtualScroll,
            isFixedHeight,
            height,
            alwaysScrollbar,
        };
    },
};
</script>
