<template>
  <Repl
    :store="store"
    :showImportMap="true"
    :showCompileOutput="false"
    :clearConsole="false"
  />
</template>

<script setup>
import { version } from 'vue'
import { Repl, ReplStore } from '@vue/repl'
import '@vue/repl/style.css'
import data from './demoCode.json'
const mainFile = 'App.vue';


const store = new ReplStore({
  defaultVueRuntimeURL: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.js`
})

const fesDesignSetup = `
// ⛔️ ⛔️ ⛔️
// 不要修改此文件！该文件在共享时被还原
import { getCurrentInstance } from 'vue';
import 'fes-design';
export function loadStyle() {
  const hasLinks = document.querySelectorAll('link');
  for(let l of hasLinks) {
    if (/fesDesign.min.css/.test(l.href)) return;
  }

  const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = 'https://unpkg.com/@fesjs/fes-design@latest/dist/fesDesign.min.css';
	document.head.appendChild(link)
}

export function setupFesDesign() {
  loadStyle();
  const instance = getCurrentInstance()
  instance.appContext.app.use(FesDesign);
}
`;

function resolveSFCExample() {
    const files = {
        [mainFile]: data['button.type'],
        'fes-design.js': fesDesignSetup,
        'import-map.json': JSON.stringify({
          imports: {
            'fes-design': 'https://unpkg.com/@fesjs/fes-design@latest/dist/fesDesign.min.js'
          }
        })
    };
    return files;
}

function updateExample() {
  store.setFiles(resolveSFCExample(), mainFile)
}
updateExample();
</script>

<style scoped>
.vue-repl {
  max-width: 1105px;
  border-right: 1px solid var(--vt-c-divider-light);
  height: calc(100vh - var(--vp-nav-height));
}

@media (max-width: 960px) {
  .vue-repl {
    border: none;
    height: calc(100vh - var(--vp-nav-height) - 48px);
  }
}
</style>