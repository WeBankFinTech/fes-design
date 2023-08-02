<template>
    <FTabs>
        <FTabPane name="show" displayDirective="show" value="show">
            <FInput
                style="margin-top: 20px"
                placeholder="切换tab内容不会被重置"
            />
        </FTabPane>
        <FTabPane name="show2" displayDirective="show" value="show2">
            <FInput
                style="margin-top: 20px"
                placeholder="切换tab内容不会被重置"
            />
        </FTabPane>
        <FTabPane name="if" displayDirective="if" value="if">
            <FInput style="margin-top: 20px" placeholder="切换tab内容被重置" />
        </FTabPane>
        <FTabPane
            name="show:lazy"
            displayDirective="show:lazy"
            value="show:lazy"
        >
            <FInput
                style="margin-top: 20px"
                placeholder="延迟加载，并且之后的切换内容不会重置"
            />
        </FTabPane>
    </FTabs>
</template>
