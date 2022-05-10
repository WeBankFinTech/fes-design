<template>
    <FSwitch :beforeChange="beforeChange"> </FSwitch>
</template>
<script>
export default {
    setup() {
        const beforeChange = () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 2000);
            });
        };
        return {
            beforeChange,
        };
    },
};
</script>
