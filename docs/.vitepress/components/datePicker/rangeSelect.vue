<template>
    <Space>
        <FDatePicker type="daterange" clearable />
        <FDatePicker type="daterange" :modelValue="[Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000]" >
            <template #separator>
                至
            </template>
        </FDatePicker>
        <FDatePicker type="datetimerange" />
    </Space>
</template>