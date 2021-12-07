

<template>
  <Repl
    :store="store"
    :showImportMap="!preferSFC"
    :showCompileOutput="false"
    :clearConsole="false"
  />
</template>

<script setup>
import { Repl, ReplStore } from '@vue/repl'
import '@vue/repl/style.css'
import data from './data.json'
import { watchEffect, version, Ref } from 'vue'

const store = new ReplStore({
  defaultVueRuntimeURL: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.js`
})

watchEffect(updateExample)
window.addEventListener('hashchange', updateExample)

function updateExample() {
  let hash = location.hash.slice(1)
  if (!data.hasOwnProperty(hash)) {
    hash = 'hello-world'
    location.hash = `#${hash}`
  }
  store.setFiles(
    preferSFC.value
      ? resolveSFCExample(data[hash])
      : resolveNoBuildExample(data[hash]),
    preferSFC.value ? 'App.vue' : 'index.html'
  )
}

function resolveSFCExample(raw) {
  const files = {}
  forEachComponent(
    raw,
    files,
    (filename, { template, composition, options, style }) => {
      let sfcContent =
        filename === 'App' ? `<!--\n${raw['description.txt']}\n-->\n\n` : ``
      if (preferComposition.value) {
        sfcContent += `<script setup>\n${toScriptSetup(
          composition,
          template
        )}<\/script>`
      } else {
        sfcContent += `<script>\n${options}<\/script>`
      }
      sfcContent += `\n\n<template>\n${indent(template)}</template>`
      if (style) {
        sfcContent += `\n\n<style>\n${style}</style>`
      }
      files[filename + '.vue'] = sfcContent
    }
  )
  return files
}


function forEachComponent(
  raw,
  files,
  cb
) {
  for (const filename in raw) {
    const content = raw[filename]
    if (filename === 'description.txt') {
      continue
    } else if (typeof content === 'string') {
      files[filename] = content
    } else {
      const {
        'template.html': template,
        'composition.js': composition,
        'options.js': options,
        'style.css': style
      } = content
      cb(filename, { template, composition, options, style })
    }
  }
}

function toScriptSetup(src, template) {
  const exportDefaultIndex = src.indexOf('export default')
  const lastReturnIndex = src.lastIndexOf('return {')

  let setupCode =
    lastReturnIndex > -1
      ? deindent(
          src
            .slice(exportDefaultIndex, lastReturnIndex)
            .replace(/export default[^]+?setup\([^)]*\)\s*{/, '')
            .trim()
        )
      : ''

  const propsStartIndex = src.indexOf(`\n  props:`)
  if (propsStartIndex > -1) {
    const propsEndIndex = src.indexOf(`\n  }`, propsStartIndex) + 4
    const propsVar =
      /\bprops\b/.test(template) || /\bprops\b/.test(src)
        ? `const props = `
        : ``
    const propsDef = deindent(
      src
        .slice(propsStartIndex, propsEndIndex)
        .trim()
        .replace(/,$/, '')
        .replace(/^props: /, `${propsVar}defineProps(`) + ')',
      1
    )
    setupCode = (propsDef + '\n\n' + setupCode).trim()
  }

  return src.slice(0, exportDefaultIndex) + setupCode + '\n'
}

function indent(str) {
  return str
    .split('\n')
    .map((l) => (l.trim() ? `  ${l}` : l))
    .join('\n')
}

function deindent(str, tabsize = 2) {
  return str
    .split('\n')
    .map((l) => l.replace(tabsize === 1 ? /^\s{2}/ : /^\s{4}/, ''))
    .join('\n')
}

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
