<template>
    <FDrawer
        v-model:show="isShow"
        title="Playground"
        display-directive="show"
        :mask-closable="false"
        width="90%"
        @ok="isShow = false"
    >
        <Repl
            v-if="props.codeName"
            :editor="CodeMirror"
            :store="store"
            :show-ts-config="false"
            :show-import-map="true"
            :show-compile-output="false"
            :clear-console="false"
        />
    </FDrawer>
</template>

<script setup>
import { ref, version, watch } from 'vue';

import CodeMirror from '@vue/repl/codemirror-editor';

import { Repl, ReplStore } from '@vue/repl';
import { FDrawer } from '@fesjs/fes-design';

import '@vue/repl/style.css';
import data from './demoCode.json';

const props = defineProps({
    codeName: String,
});
const mainFile = 'src/App.vue';
const demoFile = 'src/demo.vue';

const store = new ReplStore({
    defaultVueRuntimeURL: `https://registry.npmmirror.com/vue/${version}/files/dist/vue.esm-browser.js`,
});

const fesDesignSetup = `
// 不要修改此文件!!!
import { getCurrentInstance } from 'vue';
import FesDesign from '@fesjs/fes-design';
import * as Icons from '@fesjs/fes-design/icon';
export function loadStyle() {
  const hasLinks = document.querySelectorAll('link');
  for(let l of hasLinks) {
    if (/fes-design.min.css/.test(l.href)) return;
  }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://registry.npmmirror.com/@fesjs/fes-design/latest/files/dist/fes-design.min.css';
    document.head.appendChild(link)
}

export function setupFesDesign() {
  loadStyle();
  const instance = getCurrentInstance()
  instance.appContext.app.use(FesDesign);
  Object.keys(Icons).forEach((iconName) => {
      instance.appContext.app.component(iconName, Icons[iconName]);
  });
}
`;

const defaultFiles = {
    [mainFile]: data.app,
    'src/fes-design.js': fesDesignSetup,
    'import-map.json': JSON.stringify({
        imports: {
            '@fesjs/fes-design':
                'https://registry.npmmirror.com/@fesjs/fes-design/latest/files/dist/fes-design.esm-browser.js',
            '@fesjs/fes-design/icon':
                'https://registry.npmmirror.com/@fesjs/fes-design/latest/files/dist/fes-design.icon-browser.js',
        },
    }),
};
store.setFiles(defaultFiles);
store.setActive(mainFile);
function resolveSFCExample(demo) {
    defaultFiles[demoFile] = data[demo];
    return defaultFiles;
}

function updateExample(fileName) {
    store.setFiles(resolveSFCExample(fileName), mainFile).then(() => {
        store.setActive(demoFile);
    });
}

watch(
    () => props.codeName,
    () => {
        updateExample(props.codeName);
    },
    {
        immediate: true,
    },
);

const isShow = ref(true);
function handleShow(val) {
    isShow.value = val;
}
defineExpose({
    isShow,
    handleShow,
});
</script>

<style scoped>
.vue-repl {
    border-right: 1px solid var(--vt-c-divider-light);
    height: calc(100vh - 88px);
}
</style>
