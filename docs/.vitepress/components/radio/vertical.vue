<template>
    <FSpace>
        <FRadioGroup vertical>
            <FRadio :value="1">1</FRadio>
            <FRadio :value="2">22</FRadio>
            <FRadio :value="3">333</FRadio>
            <FRadio :value="4">4444</FRadio>
        </FRadioGroup>
        <FRadioGroup vertical disabled>
            <FRadio :value="1">1</FRadio>
            <FRadio :value="2">22</FRadio>
            <FRadio :value="3">333</FRadio>
            <FRadio :value="4">4444</FRadio>
        </FRadioGroup>
    </FSpace>
</template>
