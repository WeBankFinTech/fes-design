<template>
    <div class="space-wrapper">
        <FSpace align="start">
            text
            <FButton>Button</FButton>

            <div class="box-wrapper">
                <FSpace vertical>
                    text
                    <FButton>Button</FButton>
                </FSpace>
            </div>
        </FSpace>
    </div>
    <div class="space-wrapper">
        <FSpace align="center">
            text
            <FButton>Button</FButton>

            <div class="box-wrapper">
                <FSpace vertical>
                    text
                    <FButton>Button</FButton>
                </FSpace>
            </div>
        </FSpace>
    </div>
</template>

<style scoped>
.space-wrapper {
    width: 250px;
    margin-bottom: 20px;
    padding: 8px;
    border: 1px solid #ccc;
}
.box-wrapper {
    border: 1px solid #ccc;
    padding: 8px;
}
</style>
