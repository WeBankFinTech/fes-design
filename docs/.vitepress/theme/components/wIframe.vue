<template>
    <div class="iframe-wrapper">
        <iframe class="iframe" :style="{ height }" :src="src" />
    </div>
</template>

<script>
export default {
    props: {
        src: String,
        height: {
            type: String,
            default: '0px',
        },
    },
    setup() {
        return {};
    },
};
</script>

<style lang="less" scoped>
.iframe-wrapper {
    position: relative;
    border-top: 2em solid rgba(230, 230, 230, 0.7);
    border-radius: 3px 3px 0 0;
    box-shadow: 0 0.1em 0.5em 0 rgb(0 0 0 / 28%);
    box-sizing: border-box;
    &::before {
        position: absolute;
        top: -1.25em;
        left: 1em;
        display: block;
        width: 0.5em;
        height: 0.5em;
        background-color: #f44;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #f44, 1.5em 0 0 2px #9b3, 3em 0 0 2px #fb5;
        content: '';
    }
    &::after {
        position: absolute;
        top: -1.6em;
        left: 5.5em;
        display: block;
        width: calc(100% - 6em);
        height: 1.2em;
        background-color: #fff;
        border-radius: 2px;
        content: '';
    }
    .iframe {
        display: block;
        width: 100%;
        border: 0;
    }
}
</style>
