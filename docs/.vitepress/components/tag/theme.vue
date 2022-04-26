<template>
    <FSpace>
        <div class="tag-group">
            <span class="tag-group__title">默认：</span>
            <FTag
                v-for="item in effectTags"
                :key="item.name"
                :type="item.type"
                effect=""
            >
                {{ item.name }}
            </FTag>
        </div>
        <div class="tag-group">
            <span class="tag-group__title">Light：</span>
            <FTag
                v-for="item in effectTags"
                :key="item.name"
                :type="item.type"
                closable
                effect="light"
            >
                {{ item.name }}
            </FTag>
        </div>
        <div class="tag-group">
            <span class="tag-group__title">Dark：</span>
            <FTag
                v-for="item in effectTags"
                :key="item.name"
                :type="item.type"
                closable
                effect="dark"
            >
                {{ item.name }}
            </FTag>
        </div>
        <div class="tag-group">
            <span class="tag-group__title">Plain：</span>
            <FTag
                v-for="item in effectTags"
                :key="item.name"
                :type="item.type"
                closable
                effect="plain"
            >
                {{ item.name }}
            </FTag>
        </div>
    </FSpace>
</template>

<script>
export default {
    setup() {
        // 不同主题
        const effectTags = [
            { name: 'Default', type: 'default' },
            { name: 'Success', type: 'success' },
            { name: 'Info', type: 'info' },
            { name: 'Warning', type: 'warning' },
            { name: 'Danger', type: 'danger' },
        ];
        return {
            effectTags,
        };
    },
};
</script>

<style>
.tag-group .fes-tag {
    margin-right: 12px;
}
</style>

<style scoped>
.tag-group {
    display: flex;
    align-items: center;
}
.tag-group + .tag-group {
    margin-top: 10px;
}
.tag-group__title {
    width: 100px;
    font-size: 14px;
}
</style>
