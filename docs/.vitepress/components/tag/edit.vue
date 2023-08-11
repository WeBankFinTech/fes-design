<template>
    <FSpace>
        <FTag
            v-for="tag in dynamicTags.state.tags"
            :key="tag"
            closable
            @close="dynamicTags.handleClose(tag)"
        >
            {{ tag }}
        </FTag>
        <div>
            <FInput
                v-if="dynamicTags.state.inputVisible"
                ref="inputRef"
                v-model="dynamicTags.state.inputValue"
                class="input-tag"
                size="small"
                @change="dynamicTags.handleInputConfirm"
            >
            </FInput>
            <FButton v-else class="button-tag" @click="dynamicTags.showInput">
                + New Tag
            </FButton>
        </div>
    </FSpace>
</template>

<script>
import { reactive, nextTick, ref } from 'vue';

const useDynamicTags = (inputRef) => {
    const state = reactive({
        tags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: '',
    });

    const handleClose = (tag) => {
        state.tags.splice(state.tags.indexOf(tag), 1);
    };
    const showInput = async () => {
        state.inputVisible = true;
        await nextTick();
        inputRef.value?.focus();
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
        const inputRef = ref(null);
        // 动态编辑标签
        const dynamicTags = useDynamicTags(inputRef);

        return {
            dynamicTags,
            inputRef,
        };
    },
};
</script>

<style scoped>
.input-tag,
.button-tag {
    width: 100px;
}
</style>
