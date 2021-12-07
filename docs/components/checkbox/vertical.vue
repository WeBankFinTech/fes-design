<template>
    <space>
        <FCheckboxGroup vertical>
            <FCheckbox :value="1">111</FCheckbox>
            <FCheckbox :value="2">222</FCheckbox>
            <FCheckbox :value="3">333</FCheckbox>
        </FCheckboxGroup>
        <FCheckboxGroup vertical disabled>
            <FCheckbox :value="1">111</FCheckbox>
            <FCheckbox :value="2">222</FCheckbox>
            <FCheckbox :value="3">333</FCheckbox>
        </FCheckboxGroup>
    </space>
</template>
