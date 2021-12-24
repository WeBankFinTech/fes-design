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

store.setImportMap({
  imports: {
    'fes-design': 'https://unpkg.com/@fesjs/fes-design@latest/dist/fesDesign.min.js'
  }
})

const fesDesignSetup = `import { getCurrentInstance } from 'vue'
import FesDesign from 'fes-design'

export function setupFesDesign() {
  const instance = getCurrentInstance()
  instance.appContext.app.use(FesDesign)
  loadStyle();
}

export function loadStyle() {
  const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = 'https://unpkg.com/@fesjs/fes-design@latest/dist/fesDesign.min.css'
	document.body.appendChild(link)
}`;

function resolveSFCExample() {
    const files = {
        [mainFile]: data['button.type'],
        'fes-design.js': fesDesignSetup
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