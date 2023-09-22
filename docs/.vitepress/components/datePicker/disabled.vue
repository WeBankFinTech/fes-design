<template>
    <FSpace vertical>
        <FDatePicker disabled />
        <FDatePicker :modelValue="Date.now()" disabled />
        <FDatePicker type="daterange" disabled />
        <FDatePicker
            :modelValue="[Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000]"
            type="daterange"
            disabled
        />
        <FDatePicker type="datemultiple" disabled />
        <FDatePicker
            :modelValue="[Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000]"
            type="datemultiple"
            disabled
        />
    </FSpace>
</template>
