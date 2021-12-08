<template>
    <space>
        <FRadioGroup>
            <FRadio :value="1">1</FRadio>
            <FRadio :value="2">2</FRadio>
            <FRadio :value="3">3</FRadio>
            <FRadio :value="4">4</FRadio>
        </FRadioGroup>
        <FRadioGroup disabled>
            <FRadio :value="1">1</FRadio>
            <FRadio :value="2">2</FRadio>
            <FRadio :value="3">3</FRadio>
            <FRadio :value="4">4</FRadio>
        </FRadioGroup>
    </space>
</template>
