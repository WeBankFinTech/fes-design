<template>
    <FSpace direction="vertical">
        <FText>
            This is text mixed icon
            <BellOutlined />
            and component
            <FButton>Button</FButton>
            and
            <FText>a subtext</FText>
            .
        </FText>
        <FEllipsis :tooltip="{ showAfter: 500 }" style="max-width: 240px">
            <FText>
                This is text mixed icon
                <BellOutlined />
                and component
                <FButton>Button</FButton>
                and
                <FText>a subtext</FText>
                .
            </FText>
        </FEllipsis>
    </FSpace>
</template>

<script setup>
import { BellOutlined } from '@fesjs/fes-design/icon';
</script>
