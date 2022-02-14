<template>
    <div class="tooltip-wrapper">
        <FTooltip content="top-start" placement="top-start">
            <FButton class="w-100 ml-100">top-start</FButton>
        </FTooltip>
        <FTooltip content="top" placement="top">
            <FButton class="w-100 ml-20">top</FButton>
        </FTooltip>
        <FTooltip content="top-end" placement="top-end">
            <FButton class="w-100 ml-20">top-end</FButton>
        </FTooltip>
        <br />
        <FTooltip content="left-start" placement="left-start">
            <FButton class="w-100 mt-20">left-start</FButton>
        </FTooltip>
        <FTooltip content="right-start" placement="right-start">
            <FButton class="w-100 mt-20 ml-340">right-start</FButton>
        </FTooltip>
        <br />
        <FTooltip content="left" placement="left">
            <FButton class="w-100 mt-20">left</FButton>
        </FTooltip>
        <FTooltip content="right" placement="right">
            <FButton class="w-100 mt-20 ml-340">right</FButton>
        </FTooltip>
        <br />
        <FTooltip content="left-end" placement="left-end">
            <FButton class="w-100 mt-20">left-end</FButton>
        </FTooltip>
        <FTooltip content="right-end" placement="right-end">
            <FButton class="w-100 mt-20 ml-340">right-end</FButton>
        </FTooltip>
        <br />
        <FTooltip content="bottom-start" placement="bottom-start">
            <FButton class="w-100 mt-20 ml-100">bottom-start</FButton>
        </FTooltip>
        <FTooltip content="bottom" placement="bottom">
            <FButton class="w-100 mt-20 ml-20">bottom</FButton>
        </FTooltip>
        <FTooltip content="bottom-end" placement="bottom-end">
            <FButton class="w-100 mt-20 ml-20">bottom-end</FButton>
        </FTooltip>
    </div>
</template>

<style scoped>
.tooltip-wrapper {
    min-width: 560px;
}
.tooltip-wrapper .w-100 {
    width: 100px;
}
.tooltip-wrapper .ml-100 {
    margin-left: 100px;
}
.tooltip-wrapper .ml-20 {
    margin-left: 20px;
}
.tooltip-wrapper .ml-340 {
    margin-left: 340px;
}
.tooltip-wrapper .mt-20 {
    margin-top: 20px;
}
.porper {
    width: 100px;
}
</style>
