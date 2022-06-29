<template>
    <FTabs>
        <FTabPane name="左对齐" value="左对齐">
            <div class="tab-content">
                <FForm :labelWidth="80" labelPosition="left">
                    <FFormItem label="姓名">
                        <FInput placeholder="请输入姓名"></FInput>
                    </FFormItem>
                    <FFormItem label="手机号码">
                        <FInput placeholder="请输入手机号码"></FInput>
                    </FFormItem>
                </FForm>
            </div>
        </FTabPane>
        <FTabPane name="右对齐" value="右对齐" displayDirective="show">
            <div class="tab-content">
                <FForm :labelWidth="80" labelPosition="right">
                    <FFormItem label="姓名">
                        <FInput placeholder="请输入姓名"></FInput>
                    </FFormItem>
                    <FFormItem label="手机号码">
                        <FInput placeholder="请输入手机号码"></FInput>
                    </FFormItem>
                </FForm>
            </div>
        </FTabPane>
        <FTabPane name="顶部对齐" value="顶部对齐">
            <div class="tab-content">
                <FForm :labelWidth="80" labelPosition="top">
                    <FFormItem label="姓名">
                        <FInput placeholder="请输入姓名"></FInput>
                    </FFormItem>
                    <FFormItem label="手机号码">
                        <FInput placeholder="请输入手机号码"></FInput>
                    </FFormItem>
                </FForm>
            </div>
        </FTabPane>
    </FTabs>
</template>

<style scoped>
.tab-content {
    margin-top: 24px;
}
.fes-form {
    width: 600px;
}
</style>
