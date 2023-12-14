<template>
    <FSpace>
        <FBadge :value="10" backgroundColor="blue" class="item">
            <FButton> Primary </FButton>
        </FBadge>
        <FBadge :value="50" backgroundColor="green" class="item">
            <FButton> Success </FButton>
        </FBadge>
        <FBadge :value="80" backgroundColor="orange" class="item">
            <FButton> Warning </FButton>
        </FBadge>
        <FBadge :value="100" backgroundColor="#FF0000" class="item">
            <FButton> Danger </FButton>
        </FBadge>
    </FSpace>
</template>

<style>
.item {
    margin-right: 20px;
}
</style>
