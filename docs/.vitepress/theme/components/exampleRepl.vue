<template>
    <FDrawer
        v-model:show="isShow"
        title="Playground"
        displayDirective="show"
        :maskClosable="false"
        width="90%"
        @ok="isShow = false"
    >
        <Repl
            v-if="props.codeName"
            :editor="CodeMirror"
            :store="store"
            :showImportMap="true"
            :showCompileOutput="false"
            :clearConsole="false"
        />
    </FDrawer>
</template>

<script setup>
import { version, ref, watch } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { FDrawer } from '@fesjs/fes-design';
import CodeMirror from '@vue/repl/codemirror-editor';

import { Repl, ReplStore } from '@vue/repl';
// eslint-disable-next-line import/no-unresolved
import '@vue/repl/style.css';
import data from './demoCode.json';
const mainFile = 'src/App.vue';
const demoFile = 'src/demo.vue';

const props = defineProps({
    codeName: String,
});

const store = new ReplStore({
    defaultVueRuntimeURL: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.js`,
});

const fesDesignSetup = `
// 不要修改此文件!!!
import { getCurrentInstance } from 'vue';
import Space from './space.vue';
import FesDesign from '@fesjs/fes-design';
import * as Icons from '@fesjs/fes-design/icon';
export function loadStyle() {
  const hasLinks = document.querySelectorAll('link');
  for(let l of hasLinks) {
    if (/fes-design.min.css/.test(l.href)) return;
  }

  const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = 'https://unpkg.com/@fesjs/fes-design@latest/dist/fes-design.min.css';
	document.head.appendChild(link)
}

export function setupFesDesign() {
  loadStyle();
  const instance = getCurrentInstance()
  instance.appContext.app.use(FesDesign);
  Object.keys(Icons).forEach((iconName) => {
      instance.appContext.app.component(iconName, Icons[iconName]);
  });
  instance.appContext.app.component('Space', Space)
}
`;

const defaultFiles = {
    [mainFile]: data.app,
    'src/space.vue': data.space,
    'src/fes-design.js': fesDesignSetup,
    'import-map.json': JSON.stringify({
        imports: {
            '@fesjs/fes-design':
                'https://unpkg.com/@fesjs/fes-design@latest/dist/fes-design.esm-browser.js',
            '@fesjs/fes-design/icon':
                'https://unpkg.com/@fesjs/fes-design@latest/dist/fes-design.icon-browser.js',
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
const handleShow = (val) => {
    isShow.value = val;
};
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
