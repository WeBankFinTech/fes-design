## [0.5.5](https://github.com/WeBankFinTech/fes-design/compare/v0.5.4...v0.5.5) (2022-05-23)


### Bug Fixes

* Ellipsis未渲染完毕时计算出是不tooltip,而实际上是需要tooltip ([#162](https://github.com/WeBankFinTech/fes-design/issues/162)) ([000af71](https://github.com/WeBankFinTech/fes-design/commit/000af71f1d80a9c6c358720eb76a98038c3411de))
* FSelectCascader 兼容 showPath 时未匹配到值的初始化展示 ([#161](https://github.com/WeBankFinTech/fes-design/issues/161)) ([85e6fdc](https://github.com/WeBankFinTech/fes-design/commit/85e6fdc3cfc0aec116cdebe278f6466b7e179341))



## [0.5.4](https://github.com/WeBankFinTech/fes-design/compare/v0.5.3...v0.5.4) (2022-05-20)


### Bug Fixes

* **draggable:** wait for dom updated when props changed ([#160](https://github.com/WeBankFinTech/fes-design/issues/160)) ([d52deed](https://github.com/WeBankFinTech/fes-design/commit/d52deedeb51fb21fa40a7a5596ac7e88f8175de6))



## [0.5.3](https://github.com/WeBankFinTech/fes-design/compare/v0.5.2...v0.5.3) (2022-05-20)


### Bug Fixes

* time-picker 选 此刻 无法生效问题 ([#159](https://github.com/WeBankFinTech/fes-design/issues/159)) ([2e07b3f](https://github.com/WeBankFinTech/fes-design/commit/2e07b3feb6c632c895b85eefe0a67479fd645a44))



## [0.5.2](https://github.com/WeBankFinTech/fes-design/compare/v0.5.1...v0.5.2) (2022-05-19)


### Bug Fixes

* component cascader load ([#153](https://github.com/WeBankFinTech/fes-design/issues/153)) ([f688a0f](https://github.com/WeBankFinTech/fes-design/commit/f688a0fdaf6e180ab30614b8dcea13000928d391))
* datePicker 聚焦问题 + range disabled 问题 ([#157](https://github.com/WeBankFinTech/fes-design/issues/157)) ([e658ce3](https://github.com/WeBankFinTech/fes-design/commit/e658ce387ef0b9edf40ee525cace4165d04e5f81))
* datePicker confirm 日期错误 ([#156](https://github.com/WeBankFinTech/fes-design/issues/156)) ([375a6af](https://github.com/WeBankFinTech/fes-design/commit/375a6afe93d12ed1911c8296de7f2dfd25da9377))
* FDrawer | FModal 关闭 icon 颜色加深 ([#155](https://github.com/WeBankFinTech/fes-design/issues/155)) ([9f8198e](https://github.com/WeBankFinTech/fes-design/commit/9f8198eb9c8f108ecae9dcd83f118330ad14093c))



## [0.5.1](https://github.com/WeBankFinTech/fes-design/compare/v0.5.0...v0.5.1) (2022-05-13)


### Bug Fixes

* cascader组件初始化加载节点 ([#152](https://github.com/WeBankFinTech/fes-design/issues/152)) ([2b597e7](https://github.com/WeBankFinTech/fes-design/commit/2b597e79b3e6852e0890481ff18d0311d2bc3a89))



# [0.5.0](https://github.com/WeBankFinTech/fes-design/compare/v0.4.7...v0.5.0) (2022-05-13)

### Breaks

* 重构Cascader组件，改为使用SelectCascader组件
* 去掉VirtualList组件的 rootTag 属性

### Bug Fixes

* 当popper弹窗大小改变时,需要更新位置 ([#138](https://github.com/WeBankFinTech/fes-design/issues/138)) ([42affea](https://github.com/WeBankFinTech/fes-design/commit/42affea7e6fe30e872d0021302c5251fc201d7f8))
* Date-picker range 选择，输入框宽度优化 + datetime 支持hourStep minuteStep secondStep + timepicker 交互优化 ([#140](https://github.com/WeBankFinTech/fes-design/issues/140)) ([a973b43](https://github.com/WeBankFinTech/fes-design/commit/a973b43ab74547edd2fa83c35be00ef06316e6bf))
* dragable 动态插入值，不能拖拽问题 ([#146](https://github.com/WeBankFinTech/fes-design/issues/146)) ([a3c9f89](https://github.com/WeBankFinTech/fes-design/commit/a3c9f89fc974e344d7155d278f831d63627f4689))
* Form组件的inline模式下row-gap在78存在兼容性问题,改为grid实现 ([#141](https://github.com/WeBankFinTech/fes-design/issues/141)) ([3c9ac12](https://github.com/WeBankFinTech/fes-design/commit/3c9ac12ac9b62d5384482d926cc351203f00f012))
* input-number 修复 form 校验不通过时，边框变红问题 ([#148](https://github.com/WeBankFinTech/fes-design/issues/148)) ([a3b602c](https://github.com/WeBankFinTech/fes-design/commit/a3b602c1cfdc1b4c77e5905914eb02bc3be6042c))
* scrollbar能监听内容大小更新 &  去掉z-index ([#151](https://github.com/WeBankFinTech/fes-design/issues/151)) ([3f676cb](https://github.com/WeBankFinTech/fes-design/commit/3f676cb7cce7a17ae4c613ee349a0c62f3dac7bc))
* Select当只有option只有value时,可自定义内容展示，默认展示 value ([#149](https://github.com/WeBankFinTech/fes-design/issues/149)) ([d7879c1](https://github.com/WeBankFinTech/fes-design/commit/d7879c134ad842508c2cee29369e6d87904aeff4))
* Table组件修复因为fixed导致表头和列不一致的问题 ([#150](https://github.com/WeBankFinTech/fes-design/issues/150)) ([9935f2d](https://github.com/WeBankFinTech/fes-design/commit/9935f2db12cf3052e1981c1263b9c5263fe153c5))
* upload的close按钮居中 ([#139](https://github.com/WeBankFinTech/fes-design/issues/139)) ([9754f63](https://github.com/WeBankFinTech/fes-design/commit/9754f635dc2eea12c041e832de976815dd461f68))


### Features

* Date picker range 支持输入 + 自定义 format ([#147](https://github.com/WeBankFinTech/fes-design/issues/147)) ([e737fb0](https://github.com/WeBankFinTech/fes-design/commit/e737fb05c9d2b7383877ba322b9b1ec28dbf3866))
* input[text] 支持 showWordLimit ([#145](https://github.com/WeBankFinTech/fes-design/issues/145)) ([9249db8](https://github.com/WeBankFinTech/fes-design/commit/9249db87eabe18e5f76595f519cdc633bf3596e9))
* tabs 添加 change 事件 ([#142](https://github.com/WeBankFinTech/fes-design/issues/142)) ([003ec6e](https://github.com/WeBankFinTech/fes-design/commit/003ec6e2888fb120864b3d1a630cba465f7c8fdb))
* Scrollbar增加contentStyle、horizontalRatioStyle、verticalRatioStyle配置





## [0.4.7](https://github.com/WeBankFinTech/fes-design/compare/v0.4.6...v0.4.7) (2022-05-05)


### Bug Fixes

* CheckboxGroup和RadioGroup默认可换行 ([#133](https://github.com/WeBankFinTech/fes-design/issues/133)) ([2df2b76](https://github.com/WeBankFinTech/fes-design/commit/2df2b7630af31f6b37ff57c45c55d1a0883284fa))
* Pagination 手动设置 currentPage、pageSize 不触发相应事件 ([#128](https://github.com/WeBankFinTech/fes-design/issues/128)) ([99bff1e](https://github.com/WeBankFinTech/fes-design/commit/99bff1efafde4cdf2823566e24b3cbf05231f69c))
* Select等组件鼠标样式 ([#135](https://github.com/WeBankFinTech/fes-design/issues/135)) ([5877200](https://github.com/WeBankFinTech/fes-design/commit/58772003e8ae691a101d80f1dfe5ed76f1c83e84))
* 修复Select等组件的弹出层不跟随滚动 ([#136](https://github.com/WeBankFinTech/fes-design/issues/136)) ([699d2ac](https://github.com/WeBankFinTech/fes-design/commit/699d2acbd15b98c98aa13737de010a02ae8aca13))


### Features

*  Table组件在没计算出宽度前不渲染,避免导致撑开页面 & 优化keepalive下resize的逻辑 ([#132](https://github.com/WeBankFinTech/fes-design/issues/132)) ([5f2f703](https://github.com/WeBankFinTech/fes-design/commit/5f2f7030e4c2b9b96682a5281748aee623fa5df0))
* date-picker 支持输入日期 ([#119](https://github.com/WeBankFinTech/fes-design/issues/119)) ([f278f4a](https://github.com/WeBankFinTech/fes-design/commit/f278f4a9ea3c0bb860df22df0930ed09779d86c1))
* Image支持配置下载 ([#134](https://github.com/WeBankFinTech/fes-design/issues/134)) ([958dd01](https://github.com/WeBankFinTech/fes-design/commit/958dd01bec5e60d08e0c9f16cd61f11195a0d2f6))



## [0.4.6](https://github.com/WeBankFinTech/fes-design/compare/v0.4.5...v0.4.6) (2022-04-27)


### Bug Fixes

* 修复image的download为白色 ([4c0256b](https://github.com/WeBankFinTech/fes-design/commit/4c0256bd755a74e27fe1e667b209586f16818398))
* 修复ts提示问题 ([a2551f3](https://github.com/WeBankFinTech/fes-design/commit/a2551f34dfa2daf89a47b8a54ad04831c4049fc3))


### Features

* upload 添加 file slot ([#129](https://github.com/WeBankFinTech/fes-design/issues/129)) ([7e1ec84](https://github.com/WeBankFinTech/fes-design/commit/7e1ec8489e048ae8f59c46d1a67f41ab6546a0ec))



## [0.4.5](https://github.com/WeBankFinTech/fes-design/compare/v0.4.4...v0.4.5) (2022-04-25)


### Bug Fixes

* 修复设置height但是因为数据延迟获得而不滚动问题 ([#123](https://github.com/WeBankFinTech/fes-design/issues/123)) ([5bfb55e](https://github.com/WeBankFinTech/fes-design/commit/5bfb55e83ef57c2c129c3f5857f90a23cf652739))
* 修复boxsizing问题 ([#127](https://github.com/WeBankFinTech/fes-design/issues/127)) ([2980f69](https://github.com/WeBankFinTech/fes-design/commit/2980f694a01a6cce4b00ad4b27d708cff3d9892d))
* 修复inline-form样式问题 ([a32da49](https://github.com/WeBankFinTech/fes-design/commit/a32da49b073d3588bd4a70ea2bc8d9e3e3b000c1))
* input 无法输入小数 + icon docs 复制 + Modal ts 问题 ([#124](https://github.com/WeBankFinTech/fes-design/issues/124)) ([c664faf](https://github.com/WeBankFinTech/fes-design/commit/c664faf21b0ead208abffc1f59cecacef4bf776f))
* input和select样式问题 ([4f57e5d](https://github.com/WeBankFinTech/fes-design/commit/4f57e5dd47cd65e1e45af5a9deb92d96ca5efe6c))


### Features

* image支持下载 & 当配置name时展示name ([f6eb08f](https://github.com/WeBankFinTech/fes-design/commit/f6eb08f1fdbeb2c1072c7ef2f09e9ae1f93f8202))



## [0.4.4](https://github.com/WeBankFinTech/fes-design/compare/v0.4.3...v0.4.4) (2022-04-14)


### Bug Fixes

* ellipsis 多行问题 + 部分样式覆盖问题 ([#111](https://github.com/WeBankFinTech/fes-design/issues/111)) ([931405c](https://github.com/WeBankFinTech/fes-design/commit/931405c736cfcfa035ef893bfd0f013cb791f9f3))


### Features

* date-picker 支持 style ([#113](https://github.com/WeBankFinTech/fes-design/issues/113)) ([cd7b8ab](https://github.com/WeBankFinTech/fes-design/commit/cd7b8abeaac79ccef95bc9a1c32c5c97f17dfef9))
* Tree增加cancelable配置是否可以取消选中 ([#112](https://github.com/WeBankFinTech/fes-design/issues/112)) ([be77e07](https://github.com/WeBankFinTech/fes-design/commit/be77e07ec3c67073f50eb41b36eafade11c6abb7))



## [0.4.3](https://github.com/WeBankFinTech/fes-design/compare/v0.4.2...v0.4.3) (2022-04-11)


### Bug Fixes

* 快速跳转样式被覆盖问题 ([#109](https://github.com/WeBankFinTech/fes-design/issues/109)) ([e3bad59](https://github.com/WeBankFinTech/fes-design/commit/e3bad5987047a1986f7fec977c5daf7ed0c8e52c))



## [0.4.2](https://github.com/WeBankFinTech/fes-design/compare/v0.4.1...v0.4.2) (2022-04-08)


### Bug Fixes

* 表单 inline 不换行问题 ([#106](https://github.com/WeBankFinTech/fes-design/issues/106)) ([ffd1536](https://github.com/WeBankFinTech/fes-design/commit/ffd1536b1f24b4ec61ff30e7e7ff14e23a05b843))
* 修复date-picker圆角问题 + 修复 input tab 选中问题 ([#105](https://github.com/WeBankFinTech/fes-design/issues/105)) ([2fc9459](https://github.com/WeBankFinTech/fes-design/commit/2fc945949f32590a0055d354d629287c247c6f38))
* message center ([be038c9](https://github.com/WeBankFinTech/fes-design/commit/be038c9a4a3c8eb6a6a8f81b2000609a145937ca))
* Pagination 组件引入 select 样式，change 事件监听 pageSize ([5e88daa](https://github.com/WeBankFinTech/fes-design/commit/5e88daa46cb3ad9534cc997c55b037eac2365b9f))


### Features

* popper的popperClass支持obect和array ([#104](https://github.com/WeBankFinTech/fes-design/issues/104)) ([dc7122c](https://github.com/WeBankFinTech/fes-design/commit/dc7122c884bf7649409617f605eb68c60b42aaad))



## [0.4.1](https://github.com/WeBankFinTech/fes-design/compare/v0.4.0...v0.4.1) (2022-04-07)


### Features

* ellipsis新增定制Tooltip功能 ([#90](https://github.com/WeBankFinTech/fes-design/issues/90)) ([0a70dab](https://github.com/WeBankFinTech/fes-design/commit/0a70dabb97a19cdd7a0afe1410b378c0a1f516de))
* modal confirm 开放 closable ([5c04bcd](https://github.com/WeBankFinTech/fes-design/commit/5c04bcddd494f3f02da710af1d47d1969da28125))
* Table组件提供API 展开关闭行([#96](https://github.com/WeBankFinTech/fes-design/issues/96)) ([81ead27](https://github.com/WeBankFinTech/fes-design/commit/81ead273691c27db88bc3c5038b3d8a3574527a3))



# [0.4.0](https://github.com/WeBankFinTech/fes-design/compare/v0.3.12...v0.4.0) (2022-03-29)



## [0.3.12](https://github.com/WeBankFinTech/fes-design/compare/v0.3.11...v0.3.12) (2022-03-29)


### Bug Fixes

* datePicker 夸月选择问题 ([#86](https://github.com/WeBankFinTech/fes-design/issues/86)) ([9959b8e](https://github.com/WeBankFinTech/fes-design/commit/9959b8e1a8c5e975c6827d7d908e08298fd65675))
* tooltip confirmOption ([#85](https://github.com/WeBankFinTech/fes-design/issues/85)) ([4ff779b](https://github.com/WeBankFinTech/fes-design/commit/4ff779b60d1b95d9ce9239dd25fd3ad5816b5860))


### Features

* Select组件添加renderTag实现自由定制tag内容, 添加操作插槽 ([#83](https://github.com/WeBankFinTech/fes-design/issues/83)) ([c5eac7f](https://github.com/WeBankFinTech/fes-design/commit/c5eac7f31e455bcebb83d093563fb3347878815d))



## [0.3.11](https://github.com/WeBankFinTech/fes-design/compare/v0.3.10...v0.3.11) (2022-03-24)


### Bug Fixes

* 修复select下拉选项宽度问题 ([#81](https://github.com/WeBankFinTech/fes-design/issues/81)) ([e27420c](https://github.com/WeBankFinTech/fes-design/commit/e27420c01aec14df153446dfe3f9749233063521))
* 修复table渲染问题 ([#78](https://github.com/WeBankFinTech/fes-design/issues/78)) ([41b3da6](https://github.com/WeBankFinTech/fes-design/commit/41b3da64912e36841666a9b74537fb8c08c25e55))


### Features

* table不只在fixed时滚动阴影 ([#77](https://github.com/WeBankFinTech/fes-design/issues/77)) ([2e5cf95](https://github.com/WeBankFinTech/fes-design/commit/2e5cf958e7a494c6d24242b5da0a6b40d3465013))



## [0.3.10](https://github.com/WeBankFinTech/fes-design/compare/v0.3.9...v0.3.10) (2022-03-21)


### Bug Fixes

* 暴露 formItem 的 validate 事件 ([67982d2](https://github.com/WeBankFinTech/fes-design/commit/67982d284f68904a0e1d292af63b0acf05aa5a9c))
* input触发表单的input事件 ([a57bb51](https://github.com/WeBankFinTech/fes-design/commit/a57bb5119026192554c5eda8d863e3a3681e9c8f))


### Features

* prop支持属性选择 ([60f21f2](https://github.com/WeBankFinTech/fes-design/commit/60f21f22f6d3998a29545724626930cb4d3c98ad))



## [0.3.9](https://github.com/WeBankFinTech/fes-design/compare/v0.3.8...v0.3.9) (2022-03-18)



## [0.3.8](https://github.com/WeBankFinTech/fes-design/compare/v0.3.7...v0.3.8) (2022-03-16)


### Bug Fixes

* 修复 upload 组件上文文件问题 ([#72](https://github.com/WeBankFinTech/fes-design/issues/72)) ([3bc9bb6](https://github.com/WeBankFinTech/fes-design/commit/3bc9bb6e418d1c2a464f0cf242a8b7e9aaf2fd95))



## [0.3.7](https://github.com/WeBankFinTech/fes-design/compare/v0.3.6...v0.3.7) (2022-03-14)


### Bug Fixes

* menu支持异步options ([#71](https://github.com/WeBankFinTech/fes-design/issues/71)) ([941ce15](https://github.com/WeBankFinTech/fes-design/commit/941ce15b7450bb0b7fb3ec23c9f8a0a0632129f7))


### Features

* select提供选项定制和回显内容定制 ([#69](https://github.com/WeBankFinTech/fes-design/issues/69)) ([cbc9c45](https://github.com/WeBankFinTech/fes-design/commit/cbc9c4541f92b89092bebe33cfe24e2c25c2e233))



## [0.3.6](https://github.com/WeBankFinTech/fes-design/compare/v0.3.5...v0.3.6) (2022-03-11)


### Bug Fixes

* tabs closable ([#66](https://github.com/WeBankFinTech/fes-design/issues/66)) ([5b7fb31](https://github.com/WeBankFinTech/fes-design/commit/5b7fb316417b96cef16d8bfc87248b5e783da2fa))


### Features

* 组件menu的model支持类型Number ([#68](https://github.com/WeBankFinTech/fes-design/issues/68)) ([5a97901](https://github.com/WeBankFinTech/fes-design/commit/5a97901c842c2b68f1aa2e9a833333d28d01bc28))
* modal 新增垂直居中 ([#67](https://github.com/WeBankFinTech/fes-design/issues/67)) ([0f24ada](https://github.com/WeBankFinTech/fes-design/commit/0f24ada1108f0fb721b411e15c37cf7177668533))



## [0.3.5](https://github.com/WeBankFinTech/fes-design/compare/v0.3.4...v0.3.5) (2022-03-10)


### Bug Fixes

* 修复 small button radius 问题 ([#65](https://github.com/WeBankFinTech/fes-design/issues/65)) ([7a3d4ba](https://github.com/WeBankFinTech/fes-design/commit/7a3d4ba6696dabc2df3653dc2c379eb591852f7e))
* 修复类型错误 ([b8fb686](https://github.com/WeBankFinTech/fes-design/commit/b8fb686a831a8c06f57da73126c6ed7d1f8346d8))
* Select没值时不更新label问题和 cascader支持异步options ([cfeddec](https://github.com/WeBankFinTech/fes-design/commit/cfeddec27804197b8b90659a94979f58d5a5d55f))


### Features

* select支持配置valueLabel ([#64](https://github.com/WeBankFinTech/fes-design/issues/64)) ([63ca6a8](https://github.com/WeBankFinTech/fes-design/commit/63ca6a85ba62495f84486bea551119e625defc91))



## [0.3.4](https://github.com/WeBankFinTech/fes-design/compare/v0.3.3...v0.3.4) (2022-02-28)


### Bug Fixes

* 当select组件达到限制个数时无法再点击选项 ([#58](https://github.com/WeBankFinTech/fes-design/issues/58)) ([d8c8128](https://github.com/WeBankFinTech/fes-design/commit/d8c8128deaf49667262bda4f098666ba674768e7))
* 修复虚拟列表组件bug ([e06be4b](https://github.com/WeBankFinTech/fes-design/commit/e06be4b3e88aeaadeadba1270f82b3444d34ff1e))
* 优化layout去掉一些不必要的动画 ([9d921cd](https://github.com/WeBankFinTech/fes-design/commit/9d921cd836a7ec246e4f48b33043f8f770ce4167))
* space组件import ([#62](https://github.com/WeBankFinTech/fes-design/issues/62)) ([a4ca974](https://github.com/WeBankFinTech/fes-design/commit/a4ca97407a03c8020af493656fe284d72f0001d0))


### Features

* menu宽度变化增加过渡效果 ([ab8bfcf](https://github.com/WeBankFinTech/fes-design/commit/ab8bfcf36e47a685408d15265d9f6f13516d30d7))
* table支持虚拟滚动，处理大数据 ([#60](https://github.com/WeBankFinTech/fes-design/issues/60)) ([297ef8e](https://github.com/WeBankFinTech/fes-design/commit/297ef8e07e4c2956a58511f724ea8afe2f08d2f7))



## [0.3.3](https://github.com/WeBankFinTech/fes-design/compare/v0.3.2...v0.3.3) (2022-02-16)


### Bug Fixes

* 修复select当设置filterable和disable时样式问题 ([#54](https://github.com/WeBankFinTech/fes-design/issues/54)) ([f28708a](https://github.com/WeBankFinTech/fes-design/commit/f28708ac082d1c17f41e648766fa7478a7a0dc13))
* 修复window下layout组件收起时出现滚动条的问题 ([#55](https://github.com/WeBankFinTech/fes-design/issues/55)) ([7bf05e5](https://github.com/WeBankFinTech/fes-design/commit/7bf05e55c719d05c7a63d5bf3afbc96d0c153547))



## [0.3.2](https://github.com/WeBankFinTech/fes-design/compare/v0.3.1...v0.3.2) (2022-02-14)


### Bug Fixes

* 修复 input-number 加减 disbled 判断逻辑“ ([#52](https://github.com/WeBankFinTech/fes-design/issues/52)) ([5f501d8](https://github.com/WeBankFinTech/fes-design/commit/5f501d86b1e4d32016fcc9101833c3b1ed53baf7))
* 修复layout当body内容过高导致header被压缩的问题 ([4fac929](https://github.com/WeBankFinTech/fes-design/commit/4fac929e9a71ab1904ceb77c2875b32fb57348dc))
* ci ([#51](https://github.com/WeBankFinTech/fes-design/issues/51)) ([3886a4a](https://github.com/WeBankFinTech/fes-design/commit/3886a4a131d0cbfdd52e529f5f81c87fa9768499))



## [0.3.1](https://github.com/WeBankFinTech/fes-design/compare/v0.3.0...v0.3.1) (2022-02-10)


### Bug Fixes

* 修复select选择选项后宽度被撑开的问题 ([16b4eb5](https://github.com/WeBankFinTech/fes-design/commit/16b4eb555ab5bff1aa196d369d95b9695ec38ae5))



# [0.3.0](https://github.com/WeBankFinTech/fes-design/compare/v0.2.12...v0.3.0) (2022-02-10)


### Bug Fixes

* input number 设置 max 时，输入框内容重制问题 ([#44](https://github.com/WeBankFinTech/fes-design/issues/44)) ([194aab0](https://github.com/WeBankFinTech/fes-design/commit/194aab0870e3ab42b596c3a7a598d0b51a0d3347))
* 一些bug修复 ([#45](https://github.com/WeBankFinTech/fes-design/issues/45)) ([0956fe5](https://github.com/WeBankFinTech/fes-design/commit/0956fe53a9725d9ed9dc84fb0a469e9079a69bec))


### Features

* tabs切换展示增加show:lazy 和  修复 drawer 滚动样式问题 ([3c79486](https://github.com/WeBankFinTech/fes-design/commit/3c7948606d0b860e61e4fa0c08e1428b1314bfb2))


### Performance Improvements

* cascader-panel支持懒加载 ([9221455](https://github.com/WeBankFinTech/fes-design/commit/922145538b421e90cfefdd440576b29203c0adc3))



## [0.2.12](https://github.com/WeBankFinTech/fes-design/compare/v0.2.11...v0.2.12) (2022-02-08)


### Bug Fixes

* 解决 input change 行为变更引起的 input-number bug ([#43](https://github.com/WeBankFinTech/fes-design/issues/43)) ([7ece2c5](https://github.com/WeBankFinTech/fes-design/commit/7ece2c5986df7f51ed5975c499687e8c4d0433b3))
* input 添加背景色 ([6b6288e](https://github.com/WeBankFinTech/fes-design/commit/6b6288e33888088baa40a291cb25685eb0ced371))



## [0.2.11](https://github.com/WeBankFinTech/fes-design/compare/v0.2.9...v0.2.11) (2022-01-27)


### Bug Fixes

* 修复input样式问题 ([#42](https://github.com/WeBankFinTech/fes-design/issues/42)) ([2a4aeb3](https://github.com/WeBankFinTech/fes-design/commit/2a4aeb346be2f91ee8e55373b9f96e2270e1e1fd))


### Features

* 添加新图标 ([3b172cb](https://github.com/WeBankFinTech/fes-design/commit/3b172cb14f8d6f6cc39fc0ea0e91a0923fe049ff))



## [0.2.10](https://github.com/WeBankFinTech/fes-design/compare/v0.2.9...v0.2.10) (2022-01-27)


### Bug Fixes

* 修复input样式问题 ([#42](https://github.com/WeBankFinTech/fes-design/issues/42)) ([2a4aeb3](https://github.com/WeBankFinTech/fes-design/commit/2a4aeb346be2f91ee8e55373b9f96e2270e1e1fd))


### Features

* 添加新图标 ([3b172cb](https://github.com/WeBankFinTech/fes-design/commit/3b172cb14f8d6f6cc39fc0ea0e91a0923fe049ff))



## [0.2.9](https://github.com/WeBankFinTech/fes-design/compare/v0.2.8...v0.2.9) (2022-01-27)


### Bug Fixes

* side动画异常 ([3bb9981](https://github.com/WeBankFinTech/fes-design/commit/3bb9981117ee86ba36c676ee8f76a1112640db13))
* 解决 eslint-plugin-import 无法识别 exports imports 问题 ([#41](https://github.com/WeBankFinTech/fes-design/issues/41)) ([5a51d9f](https://github.com/WeBankFinTech/fes-design/commit/5a51d9fdbd83fe16fe4c0d7f47b484a5d0d874c0))


### Features

* 优化 input prefix | suffix; 修复 input-number 部分问题 ([#40](https://github.com/WeBankFinTech/fes-design/issues/40)) ([9de27be](https://github.com/WeBankFinTech/fes-design/commit/9de27becec2f996278c103d6e5f86494772bee68))
* 增加skeleton组件 ([#37](https://github.com/WeBankFinTech/fes-design/issues/37)) ([347e7c1](https://github.com/WeBankFinTech/fes-design/commit/347e7c122173c961be132d5b876b34899c122989))



## [0.2.8](https://github.com/WeBankFinTech/fes-design/compare/v0.2.7...v0.2.8) (2022-01-25)


### Bug Fixes

* 修复radioGroup和checkboxGroup样式问题 ([6479367](https://github.com/WeBankFinTech/fes-design/commit/6479367797f8ed5d30e56bbb5d0c9a235efb9a09))
* inputNumber未传入值时如果操作当0处理 ([47a10d8](https://github.com/WeBankFinTech/fes-design/commit/47a10d89eabc744ac8cfab52f01a69f58d658d86))



## [0.2.7](https://github.com/WeBankFinTech/fes-design/compare/v0.2.6...v0.2.7) (2022-01-24)


### Bug Fixes

* 修复 date-picker change 事件不调用的问题 ([#36](https://github.com/WeBankFinTech/fes-design/issues/36)) ([ee5c809](https://github.com/WeBankFinTech/fes-design/commit/ee5c8095a71e30fde3b6b1e36c9094ba3ef84641))
* cascader组件默认值选中 ([d340f14](https://github.com/WeBankFinTech/fes-design/commit/d340f141776a2ee8264c183750dd2f6804fc41d5))
* selectTree组件默认值选中 ([8000fd8](https://github.com/WeBankFinTech/fes-design/commit/8000fd8b5eb9cf723b27d8b0277fb77b9c07342e))



## [0.2.6](https://github.com/WeBankFinTech/fes-design/compare/v0.2.5...v0.2.6) (2022-01-21)


### Bug Fixes

* Menu等组件 添加border-box ([396627a](https://github.com/WeBankFinTech/fes-design/commit/396627abdf7156be8bff2a6e33d792c9850b5b00))
* tableColumn导出名称改为FTableColumn ([ea20318](https://github.com/WeBankFinTech/fes-design/commit/ea203187f4272b9d7338868281d3dd6228229723))
* 修复popper的arrow位置计算问题 ([4440d96](https://github.com/WeBankFinTech/fes-design/commit/4440d96efa6a6b34c007abd1f7a61df22f06085b))



## [0.2.5](https://github.com/WeBankFinTech/fes-design/compare/v0.2.4...v0.2.5) (2022-01-21)


### Features

* 一些组件的动效 ([7c6f6cd](https://github.com/WeBankFinTech/fes-design/commit/7c6f6cdefe5fe1702c87f001ebc412d3666900af))
* 一些组件的动效 ([8ca320b](https://github.com/WeBankFinTech/fes-design/commit/8ca320bcff583a1cb395b7f9bfcadae7ec5e941b))



## [0.2.4](https://github.com/WeBankFinTech/fes-design/compare/v0.2.3...v0.2.4) (2022-01-20)


### Bug Fixes

* form样式优化 ([a2c5e3b](https://github.com/WeBankFinTech/fes-design/commit/a2c5e3bd5fdda79a7281ee894b0dfc29363e54f6))
* 修复radio/checkbox样式问题 ([99a4ef7](https://github.com/WeBankFinTech/fes-design/commit/99a4ef7f246fa842b9cc906b18c543d7d0935c05))
* 修复select/table组件的样式问题 ([bee17fe](https://github.com/WeBankFinTech/fes-design/commit/bee17fe50dfcf9a662d4ca5655e02677e5955029))
* 修复table样式 ([0c6f096](https://github.com/WeBankFinTech/fes-design/commit/0c6f09674104c5b4d6a0ec27528ad5443be31aa4))
* 修复样式问题 ([2656b37](https://github.com/WeBankFinTech/fes-design/commit/2656b37f50295304249e73379c836e88e5dafe11))
* 避免带来https://github.com/vuejs/core/issues/5290 问题 ([a6cc93e](https://github.com/WeBankFinTech/fes-design/commit/a6cc93eb4b18ae2a98a7a0e376c2983023ccbda6))



## [0.2.3](https://github.com/WeBankFinTech/fes-design/compare/v0.2.2...v0.2.3) (2022-01-18)


### Bug Fixes

* 编译 css 问题 ([869187b](https://github.com/WeBankFinTech/fes-design/commit/869187bfcc657738ee234badeacd7aa3805ac571))
* 修复Form组件不显示错误信息 ([76a76f5](https://github.com/WeBankFinTech/fes-design/commit/76a76f58bc1e4fc9ea5d8579945b67a7c0f57abb))



## [0.2.2](https://github.com/WeBankFinTech/fes-design/compare/v0.2.1...v0.2.2) (2022-01-17)


### Bug Fixes

* layout的trigger需要背景色遮挡 ([36cf7e4](https://github.com/WeBankFinTech/fes-design/commit/36cf7e48ff35646c98906210e387956307f55e8b))
* modal、drawer、tabs ([a613c90](https://github.com/WeBankFinTech/fes-design/commit/a613c90c303adc9265a8b9edcbef75ca9551e57c))
* select默认值无法显示 ([11ca23c](https://github.com/WeBankFinTech/fes-design/commit/11ca23c4bb4b31fc59b09214cb9eafbe5d64d3da))



## [0.2.1](https://github.com/WeBankFinTech/fes-design/compare/v0.2.0...v0.2.1) (2022-01-12)


### Bug Fixes

* 修复 es 构建 ([28c3db0](https://github.com/WeBankFinTech/fes-design/commit/28c3db0253d9b206fd271e34962ef3a1f887c39d))



# [0.2.0](https://github.com/WeBankFinTech/fes-design/compare/v0.1.10...v0.2.0) (2022-01-12)


### Bug Fixes

* 去掉无用代码 ([029cfd4](https://github.com/WeBankFinTech/fes-design/commit/029cfd40bc990f794f4ec18e6bf8209f833f46f6))
* 修复 tabs 渲染问题 ([4bb9307](https://github.com/WeBankFinTech/fes-design/commit/4bb9307b9e6426328917f8d898d4cae63efe0749))
* 修复样式问题 ([f204a01](https://github.com/WeBankFinTech/fes-design/commit/f204a01a5b16f911b3c43b3a020abc26d2e4c522))
* 修复一些问题 ([8a02a9f](https://github.com/WeBankFinTech/fes-design/commit/8a02a9f02c0a549059e413987f633c6f0030cd50))
* 修复转 ts 的问题 ([d6ec147](https://github.com/WeBankFinTech/fes-design/commit/d6ec14726c22eeeddc27e01e3fa9ee6a0a9a489d))
* 修复layout中container未固定宽度和高度的样式问题 ([d5ca31d](https://github.com/WeBankFinTech/fes-design/commit/d5ca31d551407673c169e3cb6f23db3ecef10d92))
* 修复popper箭头位置问题 ([0ef202c](https://github.com/WeBankFinTech/fes-design/commit/0ef202c2e2fde8e70e50c51edac47997fb06a48d))
* 修复treebug ([41a2634](https://github.com/WeBankFinTech/fes-design/commit/41a26342417814ae56037767d918403c2d774e37))
* 修复type问题 ([87d730f](https://github.com/WeBankFinTech/fes-design/commit/87d730f093290cf0901e54c001493a477148fc5e))
* 样式问题 ([1f1a140](https://github.com/WeBankFinTech/fes-design/commit/1f1a140ae29c118691f87864c3d74a06507fddbd))
* 样式问题 ([4bccb36](https://github.com/WeBankFinTech/fes-design/commit/4bccb3679459751a2b1da22b5b62af86ed0940f3))
* cascader for ts ([b9a11d4](https://github.com/WeBankFinTech/fes-design/commit/b9a11d4defb8f4322de0bdb53b4fd9a985f2ba87))
* cascader多选 ([3591316](https://github.com/WeBankFinTech/fes-design/commit/3591316aefdccbf25c7f6b823ed4aae456deded0))
* Circular dependency for config-provider ([3c2a372](https://github.com/WeBankFinTech/fes-design/commit/3c2a372df4560e5f21c977618772080662972c1f))
* getConfig可能存在非setup环境使用 ([0e59995](https://github.com/WeBankFinTech/fes-design/commit/0e5999539a7aab981c8c353bd088183dbd49fca2))
* icon playground 问题 ([e10bc29](https://github.com/WeBankFinTech/fes-design/commit/e10bc293f1f28f4f1046c1b4b078807878b698b5))
* playground icon 问题 ([8f9251d](https://github.com/WeBankFinTech/fes-design/commit/8f9251d055982fefdf1d25f82508e6a3fcfe31b6))
* select文案展示 ([6352b52](https://github.com/WeBankFinTech/fes-design/commit/6352b529c2dde1f2d4ee74933a37a8529aacc80d))
* tag样式 ([4fa4511](https://github.com/WeBankFinTech/fes-design/commit/4fa4511d71a95d133a70020131409d0908619d93))
* tag组件样式 ([2db3adb](https://github.com/WeBankFinTech/fes-design/commit/2db3adba90ed70b1b0193b2903c3fd4146f8536f))
* time-picker 构建问题 ([a8507ca](https://github.com/WeBankFinTech/fes-design/commit/a8507cad21bb4ad6e1af60ee1a642dcf1f6f4921))
* ts for cascader ([83dd736](https://github.com/WeBankFinTech/fes-design/commit/83dd73681a5aacd81aa3d1596e6faa211e232858))
* warn for cascader docs ([cc96269](https://github.com/WeBankFinTech/fes-design/commit/cc96269d97152abe4d848fd84c7201b3101b10c9))


### Features

* 国际化文档完善 ([73ad049](https://github.com/WeBankFinTech/fes-design/commit/73ad04903a7bd1797df474f88fd18e77eda18bb1))
* 国际化支持 ([f97ff23](https://github.com/WeBankFinTech/fes-design/commit/f97ff23a38808644d5dbb07eb9fd381e6daf60a6))
* 国际化支持 ([d31e7c2](https://github.com/WeBankFinTech/fes-design/commit/d31e7c27a449e318448e81bd9a044f1e583cd864))
* 国际化支持 ([11d38a8](https://github.com/WeBankFinTech/fes-design/commit/11d38a8fd6789fae1a46f54d102a40c550a554d3))
* 国际化支持 ([f200893](https://github.com/WeBankFinTech/fes-design/commit/f200893e0d945c3ef1fb607a64f52dd768f30321))
* 优化 ts 构建 ([7053574](https://github.com/WeBankFinTech/fes-design/commit/705357436bbb179ddef48ac434c5ac8d3437743b))
* **carousel:** 新增Carousel跑马灯组件 ([7412f6d](https://github.com/WeBankFinTech/fes-design/commit/7412f6dec6c9634ea2289916f72de68f6a5f048c))
* Popper和menu动画 ([2642e9f](https://github.com/WeBankFinTech/fes-design/commit/2642e9fe05b24f1866cbb5ff977b9cfe2058756b))
* select 添加远程搜索 ([0b15c5d](https://github.com/WeBankFinTech/fes-design/commit/0b15c5d70c20a8e20f49b751876daca642e602be))
* tag优化 ([5d1ceba](https://github.com/WeBankFinTech/fes-design/commit/5d1ceba1460e253c79d6b17d3979dc83a7afccf9))



## [0.1.10](https://github.com/WeBankFinTech/fes-design/compare/v0.1.9...v0.1.10) (2022-01-04)


### Bug Fixes

* 水平方向menu子菜单中菜单高度不正确 ([d14145a](https://github.com/WeBankFinTech/fes-design/commit/d14145a9d87442c0212f42f12f63e8d17b63fe8a))


### Features

* 新增图标 ([b4f692a](https://github.com/WeBankFinTech/fes-design/commit/b4f692a830864653f0d5b7a654eda0ece53649b1))



## [0.1.9](https://github.com/WeBankFinTech/fes-design/compare/v0.1.8...v0.1.9) (2021-12-31)


### Features

* 虚拟列表监听item大小事件 ([212ac6d](https://github.com/WeBankFinTech/fes-design/commit/212ac6d9b2fd5a13d6cf0bf217440025702b2216))
* select支持虚拟滚动 ([afeb90b](https://github.com/WeBankFinTech/fes-design/commit/afeb90b0edd69c6d46f371708e71f37089f0a721))
* select支持options配置 ([f3f525a](https://github.com/WeBankFinTech/fes-design/commit/f3f525aa2321e8b1b9cf19123fd384a39c749304))
* selectTree支持虚拟列表 ([#27](https://github.com/WeBankFinTech/fes-design/issues/27)) ([9409415](https://github.com/WeBankFinTech/fes-design/commit/94094151ddb6d4825b1d3cee365e9c00cca13f19))
* tabs支持前后插槽 ([3f02d76](https://github.com/WeBankFinTech/fes-design/commit/3f02d76b024985dcc3b82db0f24e4c6adb63e9d8))
* Tree 支持虚拟列表 ([#23](https://github.com/WeBankFinTech/fes-design/issues/23)) ([1cd0c87](https://github.com/WeBankFinTech/fes-design/commit/1cd0c876e6b9dbd9d4df23a2f33a88651d040b63))



## [0.1.8](https://github.com/WeBankFinTech/fes-design/compare/v0.1.7...v0.1.8) (2021-12-29)


### Features

* table的列支持配置visible ([a1a32c5](https://github.com/WeBankFinTech/fes-design/commit/a1a32c5cae520f3a7404aeee69a9589e8e4c10bb))



## [0.1.7](https://github.com/WeBankFinTech/fes-design/compare/v0.1.6...v0.1.7) (2021-12-28)


### Bug Fixes

* cascader单选清空 ([9d24ce4](https://github.com/WeBankFinTech/fes-design/commit/9d24ce4b2e49b4bf5d177b18c5f627ec17f24cfd))
* cascader选中项关联删除 ([128fc14](https://github.com/WeBankFinTech/fes-design/commit/128fc1415acaa625ba3e8b1d0f38ab0b764b3d70))
* tree 勾选策略为parent时,选中的节点判断不正确 ([f560281](https://github.com/WeBankFinTech/fes-design/commit/f560281e636be3c0fc0f3622f3e0b5120921609b))
* 修复layout-container不撑开铺满的bug ([54df38f](https://github.com/WeBankFinTech/fes-design/commit/54df38f54e6bfa58667cba520440a1465c96a274))


### Features

* cascader支持关联选中 ([aa0ddc2](https://github.com/WeBankFinTech/fes-design/commit/aa0ddc2ce0feea3ffedca934ebb16ed368c3d931))



## [0.1.6](https://github.com/WeBankFinTech/fes-design/compare/v0.1.5...v0.1.6) (2021-12-28)


### Features

* 重构layout组件,添加border/fixed等特性 ([380d827](https://github.com/WeBankFinTech/fes-design/commit/380d827ae9243fb9b402bb32d616a8f3b2229a8f))



## [0.1.5](https://github.com/WeBankFinTech/fes-design/compare/v0.1.4...v0.1.5) (2021-12-25)


### Bug Fixes

* 修复 input select-trigger 样式问题 ([#19](https://github.com/WeBankFinTech/fes-design/issues/19)) ([a718492](https://github.com/WeBankFinTech/fes-design/commit/a7184923e0a6ecbdb52d2d118f6a960ac748bc8b))



## [0.1.4](https://github.com/WeBankFinTech/fes-design/compare/v0.1.3...v0.1.4) (2021-12-25)



## [0.1.3](https://github.com/WeBankFinTech/fes-design/compare/v0.1.2...v0.1.3) (2021-12-24)



## [0.1.2](https://github.com/WeBankFinTech/fes-design/compare/v0.1.1...v0.1.2) (2021-12-23)


### Bug Fixes

* selectTrigger的focus/blur事件无法正常抛出 ([62a3937](https://github.com/WeBankFinTech/fes-design/commit/62a393752db305e63cede153ef9b6fcf7beb5125))


### Features

* tree改变级联字段和增加级联显示模式 ([d6478b4](https://github.com/WeBankFinTech/fes-design/commit/d6478b4dee511f4136ef4251029765d884e73511))



## [0.1.1](https://github.com/WeBankFinTech/fes-design/compare/v0.1.0...v0.1.1) (2021-12-21)



# [0.1.0](https://github.com/WeBankFinTech/fes-design/compare/v0.0.6...v0.1.0) (2021-12-21)


### Bug Fixes

* 处理form-item是group(radio/checkbox)的校验问题 ([f9ba4d8](https://github.com/WeBankFinTech/fes-design/commit/f9ba4d867a8fe8432035dc8d7f4bc152d465b13b))
* 调整命名规范,修改onItemResized方法调用逻辑 ([0f37522](https://github.com/WeBankFinTech/fes-design/commit/0f37522a89cb16973abfaf3b18da2dc7c2500adc))
* 调整组件名称,删除无用代码 ([0485fe0](https://github.com/WeBankFinTech/fes-design/commit/0485fe073d7b0a6fa012528cc3fdf419b6e1d099))
* 修复 form 组件bug ([0b26bc7](https://github.com/WeBankFinTech/fes-design/commit/0b26bc755a06f1d4aee3e03e2a21e0eba05dd539))
* 修复问题 ([7a85ae7](https://github.com/WeBankFinTech/fes-design/commit/7a85ae7e8d23df6cc51d1e95b272422e83eae0af))
* 修复popper中clickout判定时机的bug + tree组件icon没对齐 ([8698ca9](https://github.com/WeBankFinTech/fes-design/commit/8698ca93a45c22393c2d66d219260fa5010e44d6))
* 修复Popper组件的trigger事件冒泡被阻止 ([1baaaf8](https://github.com/WeBankFinTech/fes-design/commit/1baaaf867acdda1a672ab4e43d67435e9f81aa69))
* 修复tree样式问题 ([1f5d596](https://github.com/WeBankFinTech/fes-design/commit/1f5d596dfe00cc1a4e12e7d01df46a6e4c25c4e6))
* 修改文档 ([3cac13a](https://github.com/WeBankFinTech/fes-design/commit/3cac13abbcb3652c11aa8716ccaab3d76a1c178d))
* button disabled 状态颜色展示问题 ([828fb5b](https://github.com/WeBankFinTech/fes-design/commit/828fb5baf3b510b3c0c746c882ef33baf5197af4))
* cascader删除项逻辑 ([1e102ff](https://github.com/WeBankFinTech/fes-design/commit/1e102ff16eae5d36b2dbc56b4716d8d921305100))
* table的data默认值错误 ([e27ae92](https://github.com/WeBankFinTech/fes-design/commit/e27ae923a7a87ffff6448d539138fad92d7800df))
* tag样式 ([ca46e0e](https://github.com/WeBankFinTech/fes-design/commit/ca46e0ec6dee337623df01d9c4397bf067ff2379))
* tag样式优化 ([5775070](https://github.com/WeBankFinTech/fes-design/commit/5775070fd728d5ba0e5fffcc37b94b37570fb1ca))


### Features

* 切换成绝对定位逻辑实现 ([fe8bc8d](https://github.com/WeBankFinTech/fes-design/commit/fe8bc8d9aa4944d3470b754504bf645f4cfcef65))
* 添加虚拟列表组件 ([0ab7c93](https://github.com/WeBankFinTech/fes-design/commit/0ab7c9329d638ad68ceadf7e1102e81997f0ad00))
* 修复form问题: ([f4346be](https://github.com/WeBankFinTech/fes-design/commit/f4346befbef9fd37ff3f9f5be263526530b04a4e))
* 重构95% ([80ef5b2](https://github.com/WeBankFinTech/fes-design/commit/80ef5b20a3dc57f0c5639a2bfaf02c2a48c23c56))
* 重构table 10% ([1c8b655](https://github.com/WeBankFinTech/fes-design/commit/1c8b6550d2cf699c0b29cac22ab09a248d467803))
* 重构table 100% ([7d92789](https://github.com/WeBankFinTech/fes-design/commit/7d92789652aff51c771c3e75c9f6089d8ff7e885))
* 重构table 30% ([0288a8f](https://github.com/WeBankFinTech/fes-design/commit/0288a8fee3301cbf90ab83e17cb5544c9aa30000))
* add theme feature ([be1ed78](https://github.com/WeBankFinTech/fes-design/commit/be1ed789008a9f64059bef27168db6964ec601cc))
* form 支持 labelMarginRight 属性 ([c353720](https://github.com/WeBankFinTech/fes-design/commit/c353720cd99bd161fe1196e12b76247a66528a76))
* form 支持 labelMarginRight 属性 ([3d78421](https://github.com/WeBankFinTech/fes-design/commit/3d784215ff259efdb21d072aa4c6e01a96a933d6))
* Select&Cascader多选时选中项折叠体验优化 ([7036ce8](https://github.com/WeBankFinTech/fes-design/commit/7036ce8546990348026a23bdddaaf0f8e25a9006))
* select支持从option.text取label ([2dc0771](https://github.com/WeBankFinTech/fes-design/commit/2dc077141fa4593f2e4931e462de5234b168d3c5))



## [0.0.8](https://github.com/WeBankFinTech/fes-design/compare/v0.0.7...v0.0.8) (2021-12-20)


### Bug Fixes

* 修复问题 ([7a85ae7](https://github.com/WeBankFinTech/fes-design/commit/7a85ae7e8d23df6cc51d1e95b272422e83eae0af))
* 修改文档 ([3cac13a](https://github.com/WeBankFinTech/fes-design/commit/3cac13abbcb3652c11aa8716ccaab3d76a1c178d))
* 调整命名规范,修改onItemResized方法调用逻辑 ([0f37522](https://github.com/WeBankFinTech/fes-design/commit/0f37522a89cb16973abfaf3b18da2dc7c2500adc))
* 调整组件名称,删除无用代码 ([0485fe0](https://github.com/WeBankFinTech/fes-design/commit/0485fe073d7b0a6fa012528cc3fdf419b6e1d099))


### Features

* form 支持 labelMarginRight 属性 ([c353720](https://github.com/WeBankFinTech/fes-design/commit/c353720cd99bd161fe1196e12b76247a66528a76))
* form 支持 labelMarginRight 属性 ([3d78421](https://github.com/WeBankFinTech/fes-design/commit/3d784215ff259efdb21d072aa4c6e01a96a933d6))
* 切换成绝对定位逻辑实现 ([fe8bc8d](https://github.com/WeBankFinTech/fes-design/commit/fe8bc8d9aa4944d3470b754504bf645f4cfcef65))
* 添加虚拟列表组件 ([0ab7c93](https://github.com/WeBankFinTech/fes-design/commit/0ab7c9329d638ad68ceadf7e1102e81997f0ad00))
* 重构95% ([80ef5b2](https://github.com/WeBankFinTech/fes-design/commit/80ef5b20a3dc57f0c5639a2bfaf02c2a48c23c56))
* 重构table 10% ([1c8b655](https://github.com/WeBankFinTech/fes-design/commit/1c8b6550d2cf699c0b29cac22ab09a248d467803))
* 重构table 100% ([7d92789](https://github.com/WeBankFinTech/fes-design/commit/7d92789652aff51c771c3e75c9f6089d8ff7e885))
* 重构table 30% ([0288a8f](https://github.com/WeBankFinTech/fes-design/commit/0288a8fee3301cbf90ab83e17cb5544c9aa30000))



## [0.0.7](https://github.com/WeBankFinTech/fes-design/compare/v0.0.6...v0.0.7) (2021-12-16)


### Bug Fixes

* 修复 form 组件bug ([0b26bc7](https://github.com/WeBankFinTech/fes-design/commit/0b26bc755a06f1d4aee3e03e2a21e0eba05dd539))
* 修复popper中clickout判定时机的bug + tree组件icon没对齐 ([8698ca9](https://github.com/WeBankFinTech/fes-design/commit/8698ca93a45c22393c2d66d219260fa5010e44d6))
* 修复Popper组件的trigger事件冒泡被阻止 ([1baaaf8](https://github.com/WeBankFinTech/fes-design/commit/1baaaf867acdda1a672ab4e43d67435e9f81aa69))
* 处理form-item是group(radio/checkbox)的校验问题 ([f9ba4d8](https://github.com/WeBankFinTech/fes-design/commit/f9ba4d867a8fe8432035dc8d7f4bc152d465b13b))


### Features

* Select&Cascader多选时选中项折叠体验优化 ([7036ce8](https://github.com/WeBankFinTech/fes-design/commit/7036ce8546990348026a23bdddaaf0f8e25a9006))
* select支持从option.text取label ([2dc0771](https://github.com/WeBankFinTech/fes-design/commit/2dc077141fa4593f2e4931e462de5234b168d3c5))
* 修复form问题: ([f4346be](https://github.com/WeBankFinTech/fes-design/commit/f4346befbef9fd37ff3f9f5be263526530b04a4e))



## [0.0.6](https://github.com/WeBankFinTech/fes-design/compare/v0.0.5...v0.0.6) (2021-12-15)


### Bug Fixes

* 修复 input 和 select 样式被覆盖问题 ([b99331a](https://github.com/WeBankFinTech/fes-design/commit/b99331a050106ed200c18e4454e4937a0685c096))
* 优化select和table细节 ([5efe839](https://github.com/WeBankFinTech/fes-design/commit/5efe839537fa8ea8134b8ecbc98569871da6702a))
* Modal.confirm ([d2a7fb3](https://github.com/WeBankFinTech/fes-design/commit/d2a7fb3e1896cb51f8bf1655f4990f8caa65ccbd))
* pagination组件totalPage显示问题 ([dc68841](https://github.com/WeBankFinTech/fes-design/commit/dc68841736fe324e16fde2d427ffe4865c22e7c0))
* Select&Cascader组件disabled多选交互 ([2536cd9](https://github.com/WeBankFinTech/fes-design/commit/2536cd9c98b5cebd271030c50fca9072f5065cc4))



## [0.0.5](https://github.com/WeBankFinTech/fes-design/compare/v0.0.4...v0.0.5) (2021-12-15)



## [0.0.4](https://github.com/WeBankFinTech/fes-design/compare/v0.0.3...v0.0.4) (2021-12-15)


### Bug Fixes

* change Button export default ([9fdff2a](https://github.com/WeBankFinTech/fes-design/commit/9fdff2a9742e008ace87c406c22133c344fdcf05))
* 换写法避免config-provider编译问题 ([7d43824](https://github.com/WeBankFinTech/fes-design/commit/7d43824b123d0dd86199ff84025a0cab5f57fb62))



## [0.0.3](https://github.com/WeBankFinTech/fes-design/compare/v0.0.2...v0.0.3) (2021-12-14)


### Bug Fixes

* 优化一些细节 ([025c05a](https://github.com/WeBankFinTech/fes-design/commit/025c05a389d45e3120158487f8d4d142d2124949))


### Features

* drawer组件 ([fcea35d](https://github.com/WeBankFinTech/fes-design/commit/fcea35d52db36e3bf4d73a96e06d86adb16772e9))



## 0.0.2 (2021-12-13)


### Bug Fixes

* 优化 Pagination 组件 ([ab2d48a](https://github.com/WeBankFinTech/fes-design/commit/ab2d48af3d2a88312456e55ec3af3ee572df09e7))
* select 文档样式加上 scoped ([a083310](https://github.com/WeBankFinTech/fes-design/commit/a083310c380191224ee461a8e5a3117e25668b4f))
* tabs、alert style ([d4905fc](https://github.com/WeBankFinTech/fes-design/commit/d4905fc995868bbbee301f812d8f349fe34ad99f))


### Features

* 表格组件 ([2d3d4d7](https://github.com/WeBankFinTech/fes-design/commit/2d3d4d70eb20cecc9e487fdd4770befadbcc1688))
* 步骤组件 ([015b73d](https://github.com/WeBankFinTech/fes-design/commit/015b73dcc3bb35bf4639fe047f282041802e9501))
* 分割线组件 ([f77659b](https://github.com/WeBankFinTech/fes-design/commit/f77659beee029255152fe41df78063a7cbd3caac))
* 分页组件 ([407ccb7](https://github.com/WeBankFinTech/fes-design/commit/407ccb7cd03f63a099532b6db1824cb8d41359e0))
* 格式化代码 ([e4c19d9](https://github.com/WeBankFinTech/fes-design/commit/e4c19d91a1d9adbac9f598d9f3a9f235e51599ba))
* 工具 ([25726e8](https://github.com/WeBankFinTech/fes-design/commit/25726e85bd8f6c07e810ea5813919f8b18385e9c))
* 基础弹窗组件 ([132087f](https://github.com/WeBankFinTech/fes-design/commit/132087f8a9fc2131cfa5080e63edd031e0b62a1a))
* 加载中组件 ([7332bdd](https://github.com/WeBankFinTech/fes-design/commit/7332bdddf2cbb6deeb09410ddc5ea4b24d163c6f))
* 配置 ([cc758c6](https://github.com/WeBankFinTech/fes-design/commit/cc758c60b8299267e3c60dea090c15d500145a3d))
* 上传组件 ([c6b2138](https://github.com/WeBankFinTech/fes-design/commit/c6b2138b2da7792e2c9f22e3df5465797ee761db))
* 树组件 ([2349ef2](https://github.com/WeBankFinTech/fes-design/commit/2349ef2e53bbe2be0b1f01495c28c6b1402b89fa))
* 文档 ([b58af2a](https://github.com/WeBankFinTech/fes-design/commit/b58af2ac25757790cb2d4c610c3f61e5986daa33))
* 下拉框组件 ([4c4e549](https://github.com/WeBankFinTech/fes-design/commit/4c4e549723693f4d59019c3c74ba434c1aa2fc6b))
* 选择器组件 ([86df8c2](https://github.com/WeBankFinTech/fes-design/commit/86df8c2d950a76d2e61bd8542a90796e0f20b530))
* alert ([5ca7e77](https://github.com/WeBankFinTech/fes-design/commit/5ca7e77dd0e75249960550791d07fb95f857b3f0))
* alert组件 ([472db94](https://github.com/WeBankFinTech/fes-design/commit/472db94a6093c0def9654b602348fa8f95cd343f))
* cascader组件 ([c9e58fb](https://github.com/WeBankFinTech/fes-design/commit/c9e58fbbf0d70a0504ceaedeb053f9fb51425e39))
* checkbox组件 ([b72cfa0](https://github.com/WeBankFinTech/fes-design/commit/b72cfa0097b3fc1f58c636821814789b48203052))
* draggable、message、modal、tabs、tooltip组件 ([111aaa9](https://github.com/WeBankFinTech/fes-design/commit/111aaa9bfdef90b168b0b92c044dd669e0f3f34e))
* Ellipsis ([7fcada1](https://github.com/WeBankFinTech/fes-design/commit/7fcada1f81a3e271700ab86ac12f7ef3479bea14))
* fes design init ([ced6632](https://github.com/WeBankFinTech/fes-design/commit/ced66321176a40882b4333e2bff0f31eafb7c8c0))
* form ([5070cf0](https://github.com/WeBankFinTech/fes-design/commit/5070cf00cb80254caa2476f6d9a70e647f241da5))
* Grid组件 ([ac51614](https://github.com/WeBankFinTech/fes-design/commit/ac51614b1114f1ed4f3c24c7a0cfde42ffdb7857))
* image组件 ([8c59a3c](https://github.com/WeBankFinTech/fes-design/commit/8c59a3c2ad881654d3f5819d30813675fb13071a))
* Layout组件 ([3f013a4](https://github.com/WeBankFinTech/fes-design/commit/3f013a4ad440ccf8c301dad43683aa9ead3a50a3))
* Menu组件 ([909bcf1](https://github.com/WeBankFinTech/fes-design/commit/909bcf19d01441ffcf4c233bf8e05a6b6ff9f1d5))
* radio组件 ([277918b](https://github.com/WeBankFinTech/fes-design/commit/277918b15ae1db210d34b6efef9227f5c0f28bb2))
* switch组件 ([18ebedf](https://github.com/WeBankFinTech/fes-design/commit/18ebedf55d075159978c99d2ad0f6ff5479bd962))
* **table:** 修复bug ([7cf583e](https://github.com/WeBankFinTech/fes-design/commit/7cf583ef18263d2b144db0019e176d6ae637ed45))
* tag ([2baf457](https://github.com/WeBankFinTech/fes-design/commit/2baf4571095acbaa5a776318d0e1b05557a73582))



