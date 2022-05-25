<template>
    <FSpace>
        <FTooltip content="hover"><FButton>hover</FButton></FTooltip>
        <FTooltip content="click" trigger="click">
            <FButton class="ml-20">click</FButton>
        </FTooltip>
        <FTooltip content="focus" trigger="focus">
            <FButton class="ml-20">focus</FButton>
        </FTooltip>
    </FSpace>
</template>
