<template>
    <FPopper placement="bottom" trigger="hover" :arrow="true" @trigger="handleTriggerChange">
        <template #trigger>
            <FButton>Hover to activate</FButton>
        </template>
        <div style="padding: 30px">
            this is content, this is content, this is content
        </div>
    </FPopper>
    <FPopper placement="top" trigger="click" :arrow="true" @trigger="handleTriggerChange">
        <template #trigger>
            <FButton style="margin-left: 10px">Click to activate</FButton>
        </template>
        <div style="padding: 30px">
            this is content, this is content, this is content
        </div>
    </FPopper>
    <FPopper placement="right" trigger="focus" :arrow="true">
        <template #trigger>
            <FButton style="margin-left: 10px">Focus to activate</FButton>
        </template>
        <div style="padding: 30px">
            this is content, this is content, this is content
        </div>
    </FPopper>
</template>

<script setup lang="ts">
const handleTriggerChange = (state: string) => {
    console.log('[popper.common] handleTriggerChange, state:', state);
};
</script>

<style scoped></style>
