<template>
    <FSpace>
        <FCheckboxGroup vertical>
            <FCheckbox :value="1">1</FCheckbox>
            <FCheckbox :value="2">22</FCheckbox>
            <FCheckbox :value="3">333</FCheckbox>
        </FCheckboxGroup>
        <FCheckboxGroup vertical disabled>
            <FCheckbox :value="1">1</FCheckbox>
            <FCheckbox :value="2">22</FCheckbox>
            <FCheckbox :value="3">333</FCheckbox>
        </FCheckboxGroup>
    </FSpace>
</template>
