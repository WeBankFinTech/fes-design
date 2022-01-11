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
            ref="inputRef"
            v-show="dynamicTags.state.inputVisible"
            v-model="dynamicTags.state.inputValue"
            size="small"
            @keyup.enter="dynamicTags.handleInputConfirm"
            @blur="dynamicTags.handleInputConfirm"
        >
        </FInput>
        <FButton v-show="!dynamicTags.state.inputVisible" class="button-nef-tag" @click="dynamicTags.showInput"
            >+ New Tag</FButton
        >
    </Space>
</template>

<script>
import { reactive, nextTick, ref, onMounted } from 'vue';

const useDynamicTags = (inputRef) => {
    const state = reactive({
        tags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: ''
    });

    const handleClose = (tag) => {
        state.tags.splice(state.tags.indexOf(tag), 1);
    };
    const showInput = async () => {
        state.inputVisible = true;
        await nextTick()
        inputRef.value?.focus()
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
        showInput,
        handleInputConfirm,
    };
};
export default {
    setup() {
        const inputRef = ref(null)
        // 动态编辑标签
        const dynamicTags = useDynamicTags(inputRef);

        return {
            dynamicTags,
            inputRef
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
