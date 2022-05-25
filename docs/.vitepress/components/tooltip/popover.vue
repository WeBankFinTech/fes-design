<template>
    <FSpace>
        <FTooltip mode="popover">
            <FButton>查看更多</FButton>
            <template #content>
                <div style="width: 300px">
                    <div v-for="i in 5" :key="i">我是内容{{ i }}</div>
                </div>
            </template>
            <template #title> 我是标题 </template>
        </FTooltip>
    </FSpace>
</template>
