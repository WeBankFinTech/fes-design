<template>
    <FSpace>
        <FForm :labelWidth="80">
            <FFormItem label="严格模式：">
                <FSwitch v-model="strict">
                    <template #active> 开 </template>
                    <template #inactive> 关 </template>
                </FSwitch>
            </FFormItem>
            <FFormItem label="高亮词：">
                <FInput
                    v-model="str"
                    placeholder="空格分隔"
                    @change="strChange"
                ></FInput>
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FTextHighlight :searchValues="searchValues" :strict="strict">
            <FText>
                This is text mixed icon
                <BellOutlined />
                and component
                <FButton>Button</FButton>
                and
                <FText>a subtext</FText>
                .
            </FText>
            <div style="font-size: 30px; margin: 10px 0px;">This is the string for the div wrap.</div>
            This is a plain text string.
        </FTextHighlight>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';
import { BellOutlined } from '@fesjs/fes-design/icon';

const searchValues = ref([]);

const str = ref('');

const strChange = () => {
    searchValues.value = str.value.split(' ');
};

const strict = ref(false);
</script>
