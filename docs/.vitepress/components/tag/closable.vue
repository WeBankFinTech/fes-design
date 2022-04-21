<template>
    <FSpace>
        <FTag
            v-for="tag in closableTags.tags"
            :key="tag.name"
            closable
            :type="tag.type"
        >
            {{ tag.name }}
        </FTag>
    </FSpace>
</template>

<script>
const useCommonTags = () => {
    const tags = [
        { name: 'Default', type: 'default' },
        { name: 'Success', type: 'success' },
        { name: 'Info', type: 'info' },
        { name: 'Warning', type: 'warning' },
        { name: 'Danger', type: 'danger' },
    ];

    return {
        tags,
    };
};
export default {
    setup() {
        const closableTags = useCommonTags();
        return {
            closableTags,
        };
    },
};
</script>
