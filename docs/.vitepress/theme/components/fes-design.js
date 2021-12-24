// ⛔️ ⛔️ ⛔️
// 不要修改此文件！该文件在共享时被还原。

import { getCurrentInstance } from 'vue'
import FesDesign from 'fes-design'

export function setupFesDesign() {
  const instance = getCurrentInstance()
  instance.appContext.app.use(FesDesign)
  loadStyle();
}

export function loadStyle() {
  const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = 'https://unpkg.com/element-plus@latest/dist/index.css'
	document.body.appendChild(link)
}