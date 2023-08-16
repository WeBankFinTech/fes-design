export const DEMO_ENTRY_FILE = `
<template>
    <Demo />
</template>

<script setup>
import {setupFesDesign } from './fes-design.js';
import Demo from './demo.vue';
setupFesDesign();
</script>
`;

export const FES_DESIGN_SETUP = `
// 请谨慎修改内容!!!
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
