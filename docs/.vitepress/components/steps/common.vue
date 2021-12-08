<template>
    <FSteps :current="2">
        <FStep title="已完成" description="All through the day, I me mine I me mine, I me mine">
        </FStep>
        <FStep title="进行中" description="When I find myself in times of trouble Mother Mary comes to me"/>
        <FStep title="待处理" description="Here come old flat top He come grooving up slowly">
            <template #icon>
                <ProductOutlined />
            </template>
        </FStep>
        <FStep title="待处理" description="Something in the way she moves Attracts me like no other lover"/>
    </FSteps>
</template>