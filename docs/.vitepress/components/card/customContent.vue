<template>
    <div class="card-wrapper">
        <FCard :bodyStyle="{ padding: '12px 0 0' }">
            <FTabs>
                <FTabPane name="tab1" value="tab1">
                    <div class="tab-content">
                        卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
                    </div>
                </FTabPane>
                <FTabPane name="tab2" value="tab2">
                    <div class="tab-content">
                        卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
                    </div>
                </FTabPane>
                <FTabPane name="tab3" value="tab3">
                    <div class="tab-content">
                        卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
                    </div>
                </FTabPane>
            </FTabs>
        </FCard>
    </div>
</template>

<style scoped>
.card-wrapper {
    width: 350px;
}
.tab-content {
    padding: 16px 24px;
    white-space: normal;
}
</style>
