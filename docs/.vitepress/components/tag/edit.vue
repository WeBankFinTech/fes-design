<template>
    <Space>
        <FTag
            :key="tag"
            v-for="tag in dynamicTags.state.tags"
            closable
            @close="dynamicTags.handleClose(tag)"
        >
            {{ tag }}
        </FTag>
        <FInput
            class="input-nef-tag"
            v-if="dynamicTags.state.inputVisible"
            v-model="dynamicTags.state.inputValue"
            size="small"
            @keyup.enter="dynamicTags.handleInputConfirm"
            @blur="dynamicTags.handleInputConfirm"
        >
        </FInput>
        <FButton v-else class="button-nef-tag" @click="dynamicTags.shoFInput"
            >+ New Tag</FButton
        >
    </Space>
</template>

<script>
import { reactive } from 'vue';

const useDynamicTags = () => {
    const state = reactive({
        tags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: ''
    });

    const handleClose = (tag) => {
        state.tags.splice(state.tags.indexOf(tag), 1);
    };
    const shoFInput = () => {
        state.inputVisible = true;
    };
    const handleInputConfirm = () => {
        let inputValue = state.inputValue;
        if (inputValue) {
            state.tags.push(inputValue);
        }
        state.inputVisible = false;
        state.inputValue = '';
    };

    return {
        state,
        handleClose,
        shoFInput,
        handleInputConfirm
    };
};
export default {
    setup() {
        // 动态编辑标签
        const dynamicTags = useDynamicTags();

        return {
            dynamicTags
        };
    }
};
</script>

<style scoped>
.button-nef-tag {
    margin-left: 10px;
}
.input-nef-tag {
    width: 100px;
    margin-left: 10px;
}
</style>
