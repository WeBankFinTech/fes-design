<template>
    <FSpace vertical>
        change 事件:
        <FInput placeholder="请输入" @change="textChange"></FInput>
        keydown 事件:
        <FInput placeholder="请输入" @keydown="keyDown"></FInput>
        input 事件:
        <FInput placeholder="请输入" @input="inputChange"></FInput>
        enter 事件:
        <FInput
            placeholder="请输入"
            @keyup.enter="keyupEnter"
            @change="keyupEnterChange"
        ></FInput>
        clear 事件:
        <FInput
            placeholder="请输入"
            clearable
            @clear="textClear"
            @input="textClearInput"
        ></FInput>
    </FSpace>
</template>

<script>
export default {
    setup() {
        const textChange = (e) => {
            console.log('[input.event] [textChange] e:', e);
        };

        const keyDown = (e) => {
            console.log('[input.event] [keyDown] e:', e);
        };

        const inputChange = (e) => {
            console.log('[input.event] [inputChange] e:', e);
        };

        const keyupEnter = (e) => {
            console.log('[input.event] [keyupEnter] e:', e);
        };
        // enter 事件会同时触发 change 事件
        const keyupEnterChange = (e) => {
            console.log('[input.event] [keyupEnterChange] e:', e);
        };

        const textClear = () => {
            console.log('[input.event] [textClear]');
        };
        // clear 事件会同时触发 input 事件
        const textClearInput = (e) => {
            console.log('[input.event] [textClearInput] e:', e);
        };

        return {
            textChange,
            keyDown,
            inputChange,
            keyupEnter,
            keyupEnterChange,
            textClear,
            textClearInput,
        };
    },
};
</script>
