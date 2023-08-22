## [0.8.5](https://github.com/WeBankFinTech/fes-design/compare/v0.8.4...v0.8.5) (2023-08-22)


### Bug Fixes

* 多语言支持兼容未配置导致取值异常的情况 ([#381](https://github.com/WeBankFinTech/fes-design/issues/381)) ([a443f79](https://github.com/WeBankFinTech/fes-design/commit/a443f79ee582f59c8542de16c439dc19b3c8ce68))
* 修复日期范围，重新选择未重新赋值的问题 ([#404](https://github.com/WeBankFinTech/fes-design/issues/404)) ([b60ddb3](https://github.com/WeBankFinTech/fes-design/commit/b60ddb34ccf7357d5748f3ccb3d642c35e0c3ca4))
* select multiple 支持 null ([#386](https://github.com/WeBankFinTech/fes-design/issues/386)) ([e115826](https://github.com/WeBankFinTech/fes-design/commit/e1158262f2da591969e662186d02be0f8fae5f94))
* steps组件，步骤描述为空时展示样式优化 ([#384](https://github.com/WeBankFinTech/fes-design/issues/384)) ([4eafe52](https://github.com/WeBankFinTech/fes-design/commit/4eafe5228ca0a6efd368fa740a758c50cb4fb150))


### Features

* 分页器simple模式可输入跳转 ([#401](https://github.com/WeBankFinTech/fes-design/issues/401)) ([ddf2372](https://github.com/WeBankFinTech/fes-design/commit/ddf2372b9ac68c059e493fa5530fc0b10899ad1b))
* 时间轴组件 ([#378](https://github.com/WeBankFinTech/fes-design/issues/378)) ([c6a1d15](https://github.com/WeBankFinTech/fes-design/commit/c6a1d1543f0d828a1802a729cd5892409b0c943a))
* 文本组件 ([#385](https://github.com/WeBankFinTech/fes-design/issues/385)) ([c961578](https://github.com/WeBankFinTech/fes-design/commit/c9615785a36c22f2e2c6a0bfc45b7c50a8480755))
* form组件增加submit事件回调及取消默认行为 ([#383](https://github.com/WeBankFinTech/fes-design/issues/383)) ([5a566fa](https://github.com/WeBankFinTech/fes-design/commit/5a566fa11dfdda771e33ea157feb33b657b0e09a))
* text组件增加size配置项 ([#395](https://github.com/WeBankFinTech/fes-design/issues/395)) ([1fd37aa](https://github.com/WeBankFinTech/fes-design/commit/1fd37aaf63a84fed50cd86e735319845ea093202))



## [0.8.4](https://github.com/WeBankFinTech/fes-design/compare/v0.8.3...v0.8.4) (2023-08-10)


### Bug Fixes

* 修复 date-picker placeholder 属性遍历导致的问题 ([#379](https://github.com/WeBankFinTech/fes-design/issues/379)) ([69ccd1f](https://github.com/WeBankFinTech/fes-design/commit/69ccd1ffc1e426baf3268626a8db1cea398b61c1))
* 修复 datePicker build ([#380](https://github.com/WeBankFinTech/fes-design/issues/380)) ([35afcd5](https://github.com/WeBankFinTech/fes-design/commit/35afcd5980528b8feef33d54f8227aa8d2a6cec3))
* 修复图片加载load顺序可能异常的问题 ([#370](https://github.com/WeBankFinTech/fes-design/issues/370)) ([e458b0b](https://github.com/WeBankFinTech/fes-design/commit/e458b0b8748db28096d83e9a68f64beb53c29e0e))
* 修复image图片src变更,loading状态未重置问题 ([#361](https://github.com/WeBankFinTech/fes-design/issues/361)) ([18fe1ea](https://github.com/WeBankFinTech/fes-design/commit/18fe1ea79411950aa33c34a9fcac5b191a9c0f8c))
* 修复input组件字体样式不是默认字体的问题 ([#376](https://github.com/WeBankFinTech/fes-design/issues/376)) ([d63ddb1](https://github.com/WeBankFinTech/fes-design/commit/d63ddb13aeb5d29e091c5b92aecc89609db53b50))


### Features

* Image组件配置支持响应式 ([#373](https://github.com/WeBankFinTech/fes-design/issues/373)) ([6c9780c](https://github.com/WeBankFinTech/fes-design/commit/6c9780ce1ea55710625c08658197b648f42e7209))



## [0.8.3](https://github.com/WeBankFinTech/fes-design/compare/v0.8.2...v0.8.3) (2023-08-01)


### Bug Fixes

* 解决option含有其他key的类型异常问题 ([#351](https://github.com/WeBankFinTech/fes-design/issues/351)) ([719023d](https://github.com/WeBankFinTech/fes-design/commit/719023d25d8f4ba7c74199158b3283a4f613ee5e))
* 修复 Switch 类型问题 ([1cf0e74](https://github.com/WeBankFinTech/fes-design/commit/1cf0e7481be2eca0c861301238ad29ac0ac201c3))
* 修改 FForm rules ts 类型 ([#350](https://github.com/WeBankFinTech/fes-design/issues/350)) ([afac056](https://github.com/WeBankFinTech/fes-design/commit/afac05680a37d3e100df3814d328ebb06be8874b))
* **select-tree:** 修正下拉宽度变更 ([#353](https://github.com/WeBankFinTech/fes-design/issues/353)) ([8ba968e](https://github.com/WeBankFinTech/fes-design/commit/8ba968e1f497bc69a32987f68df5a5de70a314ce))
* table column id重复 ([#355](https://github.com/WeBankFinTech/fes-design/issues/355)) ([96ab5e3](https://github.com/WeBankFinTech/fes-design/commit/96ab5e365f8932ffc3f450887ebf204bd9f71247))
* **Table:** 修复分割线样式问题 ([#346](https://github.com/WeBankFinTech/fes-design/issues/346)) ([cd6e098](https://github.com/WeBankFinTech/fes-design/commit/cd6e09844579b0480fbef17255aa90d82dc45459))
* **Table:** 修复有垂直分割线+拖拽宽度时的样式问题 ([#349](https://github.com/WeBankFinTech/fes-design/issues/349)) ([f203fa5](https://github.com/WeBankFinTech/fes-design/commit/f203fa572c402ae7f66ba9c7db5276752f17692f))
* table组件宽度跟随容器宽度自适应 ([#358](https://github.com/WeBankFinTech/fes-design/issues/358)) ([018fbbb](https://github.com/WeBankFinTech/fes-design/commit/018fbbb506b671733a89a6a24a8418e491c83712))


### Features

* drawer resizable可拖拽宽高度开发 ([#356](https://github.com/WeBankFinTech/fes-design/issues/356)) ([be250ca](https://github.com/WeBankFinTech/fes-design/commit/be250ca062cde85f18930a8ca06a1df5b85b0cb3))
* scripts文件格式规范 ([#359](https://github.com/WeBankFinTech/fes-design/issues/359)) ([3a990ea](https://github.com/WeBankFinTech/fes-design/commit/3a990ea9f42762fe76a02089c34f370addc8b666))
* SelectTree 支持 emitPath 和 showPath ([569fe84](https://github.com/WeBankFinTech/fes-design/commit/569fe84c3058ec01e175c8e0693ce29582eacb3e))



## [0.8.2](https://github.com/WeBankFinTech/fes-design/compare/v0.8.1...v0.8.2) (2023-07-14)


### Bug Fixes

* radio-group emits声明 ([#344](https://github.com/WeBankFinTech/fes-design/issues/344)) ([2af07e2](https://github.com/WeBankFinTech/fes-design/commit/2af07e23b5542f454ac54d795a7bc508e032dd9d))
* tabs属性displayDirective类型 ([#343](https://github.com/WeBankFinTech/fes-design/issues/343)) ([7ff006f](https://github.com/WeBankFinTech/fes-design/commit/7ff006fdddd67b1e8ffb35d6b005000fc6678330))


### Features

* 导出所有组件的 props 和 props type ([#342](https://github.com/WeBankFinTech/fes-design/issues/342)) ([404725d](https://github.com/WeBankFinTech/fes-design/commit/404725dc507dc5b384c44b1e290d914471bc1079))



## [0.8.1](https://github.com/WeBankFinTech/fes-design/compare/v0.8.0...v0.8.1) (2023-07-11)


### Bug Fixes

* select 兼容 options 为 null 的场景 ([#341](https://github.com/WeBankFinTech/fes-design/issues/341)) ([228b85d](https://github.com/WeBankFinTech/fes-design/commit/228b85de660e9bfaaf4439997f1836fc88c037db))
* **Table:** 修复多列Fixed时宽度计算问题 ([#340](https://github.com/WeBankFinTech/fes-design/issues/340)) ([2fc6959](https://github.com/WeBankFinTech/fes-design/commit/2fc695936fb2f99796f315343490d69553198174))



# [0.8.0](https://github.com/WeBankFinTech/fes-design/compare/v0.7.32...v0.8.0) (2023-07-06)


### Bug Fixes

* 修复 date-picker input 样式权重问题 ([#338](https://github.com/WeBankFinTech/fes-design/issues/338)) ([92371c5](https://github.com/WeBankFinTech/fes-design/commit/92371c52e9d894d3f0fab676444c3d32c4b79724))
* 修复Tree组件中父子节点不关联时选中逻辑问题 ([#339](https://github.com/WeBankFinTech/fes-design/issues/339)) ([7ce04f8](https://github.com/WeBankFinTech/fes-design/commit/7ce04f859b87e98750be3f59371f79685c084953))


### Features

* FUpload组件 fileList 支持 v-model 双向绑定 ([#336](https://github.com/WeBankFinTech/fes-design/issues/336)) ([490f515](https://github.com/WeBankFinTech/fes-design/commit/490f515a17f1af6cb722ac9efcf9bede3cae7cf2))
* Table的列宽支持拖拽 ([#337](https://github.com/WeBankFinTech/fes-design/issues/337)) ([9d8c750](https://github.com/WeBankFinTech/fes-design/commit/9d8c750f98b5da1f89a50caefe0ba5612672b256))



## [0.7.32](https://github.com/WeBankFinTech/fes-design/compare/v0.7.31...v0.7.32) (2023-06-19)


### Bug Fixes

* 修复 dropdown 事件穿透问题 ([#329](https://github.com/WeBankFinTech/fes-design/issues/329)) ([5fac69a](https://github.com/WeBankFinTech/fes-design/commit/5fac69a2b562738bf9c33f3e064cfd15dfab5a23))
* 隐藏 edge 浏览器 password 的眼睛 ([#325](https://github.com/WeBankFinTech/fes-design/issues/325)) ([8e23da2](https://github.com/WeBankFinTech/fes-design/commit/8e23da201625e4e689823c63ef966ed88ba0a3bf))


### Features

* Dropdown支持配置显示选择选项 ([#324](https://github.com/WeBankFinTech/fes-design/issues/324)) ([2a90158](https://github.com/WeBankFinTech/fes-design/commit/2a901584c0c8c83ba883051cd7d82e143c9c5c01))
* Table组件支持配置多个fixed ([#333](https://github.com/WeBankFinTech/fes-design/issues/333)) ([c24ed9c](https://github.com/WeBankFinTech/fes-design/commit/c24ed9c692f933f9052bcf111a28bd7a38e5a417))
* theme 可覆盖任意内部变量 ([#326](https://github.com/WeBankFinTech/fes-design/issues/326)) ([29ee93d](https://github.com/WeBankFinTech/fes-design/commit/29ee93d81819ab5c159046a6a660d49ff095c0cc))
* Tree组件节点文本过多省略 ([#332](https://github.com/WeBankFinTech/fes-design/issues/332)) ([bc31a16](https://github.com/WeBankFinTech/fes-design/commit/bc31a16ec3ad360f3fdf17fa6a77ae412aa544e5))
* Tree组件选项支持配置是否可拖拽 ([#331](https://github.com/WeBankFinTech/fes-design/issues/331)) ([07a3276](https://github.com/WeBankFinTech/fes-design/commit/07a3276c919c69afe46a8610cfece4ee258fff3a))
* 单选按钮组新增设置支持占满父元素,子按钮平分空间 ([#328](https://github.com/WeBankFinTech/fes-design/issues/328)) ([08273d0](https://github.com/WeBankFinTech/fes-design/commit/08273d0441b4cf5dfa11dd5ca4719a7459027e23))



## [0.7.31](https://github.com/WeBankFinTech/fes-design/compare/v0.7.30...v0.7.31) (2023-06-08)


### Bug Fixes

* 日期选择箭头颜色“ ([#322](https://github.com/WeBankFinTech/fes-design/issues/322)) ([4a0e485](https://github.com/WeBankFinTech/fes-design/commit/4a0e48525421bdd57e8280a93cae711c45ac03a5))



## [0.7.30](https://github.com/WeBankFinTech/fes-design/compare/v0.7.29...v0.7.30) (2023-06-08)


### Bug Fixes

* 修复主题问题 ([#321](https://github.com/WeBankFinTech/fes-design/issues/321)) ([30d2f8b](https://github.com/WeBankFinTech/fes-design/commit/30d2f8b26853684d42417f2608e1df2777d4d55e))



## [0.7.29](https://github.com/WeBankFinTech/fes-design/compare/v0.7.28...v0.7.29) (2023-06-01)


### Bug Fixes

* 日期月份切换大小月问题 ([#318](https://github.com/WeBankFinTech/fes-design/issues/318)) ([465924c](https://github.com/WeBankFinTech/fes-design/commit/465924cb3d35a50184eb4aa1f5e88721b33e714a))
* radiobtn 颜色设置为白色 ([#317](https://github.com/WeBankFinTech/fes-design/issues/317)) ([469bcb8](https://github.com/WeBankFinTech/fes-design/commit/469bcb8a5c24fc73b0d7b1c50d48c17921a2f0d8))



## [0.7.28](https://github.com/WeBankFinTech/fes-design/compare/v0.7.27...v0.7.28) (2023-05-23)


### Bug Fixes

* 更正RadioGroup文档 & 修复RadioGroup默认值为false问题 ([#314](https://github.com/WeBankFinTech/fes-design/issues/314)) ([736d86b](https://github.com/WeBankFinTech/fes-design/commit/736d86bc6f8af1f8f6aef9f9591975abda72140a))
* 解决 date-picker 可通过输入的方式超过 maxRange ([#313](https://github.com/WeBankFinTech/fes-design/issues/313)) ([a43923d](https://github.com/WeBankFinTech/fes-design/commit/a43923de49b3ced734cc384c8fa65ace9bc5eed4))
* 修复样式问题 ([#316](https://github.com/WeBankFinTech/fes-design/issues/316)) ([13582ac](https://github.com/WeBankFinTech/fes-design/commit/13582ac777eac1819d5f09c00ebc9963f840411a))
* npm服务提供商切换为unpkg.com ([4d5c65b](https://github.com/WeBankFinTech/fes-design/commit/4d5c65b5f13e83a3633a128fada991790ff56a7c))
* **table:** 修复Table组件ColumnChildren类型问题 ([#311](https://github.com/WeBankFinTech/fes-design/issues/311)) ([a2056b0](https://github.com/WeBankFinTech/fes-design/commit/a2056b07e854d476ae6dd3d65466a609f8e74907))


### Features

* Icon支持size和color配置 ([#315](https://github.com/WeBankFinTech/fes-design/issues/315)) ([09be3ab](https://github.com/WeBankFinTech/fes-design/commit/09be3abbc26ffcc50962911e39728fcab1114854))



## [0.7.27](https://github.com/WeBankFinTech/fes-design/compare/v0.7.26...v0.7.27) (2023-05-10)


### Bug Fixes

* 修复 dropdown 类型问题 ([#308](https://github.com/WeBankFinTech/fes-design/issues/308)) ([a52fcf2](https://github.com/WeBankFinTech/fes-design/commit/a52fcf2dc9052e3e408ef51f3dbfd43774f776e1))
* 修复输入框输入后回车两次触发change事件 ([#307](https://github.com/WeBankFinTech/fes-design/issues/307)) ([c35b048](https://github.com/WeBankFinTech/fes-design/commit/c35b048fc3aa619459ebd94de5d1f78e59f7f31f))


### Features

* grid组件支持响应式布局 ([#309](https://github.com/WeBankFinTech/fes-design/issues/309)) ([7b769a0](https://github.com/WeBankFinTech/fes-design/commit/7b769a07e6a6da8f47ea903a26b10e8ccb5b0f89))



## [0.7.26](https://github.com/WeBankFinTech/fes-design/compare/v0.7.25...v0.7.26) (2023-04-27)


### Features

* Table和Tabs支持列配置属性 ([#306](https://github.com/WeBankFinTech/fes-design/issues/306)) ([7e16a71](https://github.com/WeBankFinTech/fes-design/commit/7e16a719fea0a8f3c765240eea240c47e4458ce7))



## [0.7.25](https://github.com/WeBankFinTech/fes-design/compare/v0.7.24...v0.7.25) (2023-04-17)


### Bug Fixes

* radio-group options 丢失 radio 样式问题 ([#302](https://github.com/WeBankFinTech/fes-design/issues/302)) ([9814c13](https://github.com/WeBankFinTech/fes-design/commit/9814c13dad5713c2b20d3e417c61535137f2ffd8))
* radio-group 类型异常 ([#303](https://github.com/WeBankFinTech/fes-design/issues/303)) ([fce25d4](https://github.com/WeBankFinTech/fes-design/commit/fce25d41df4843917d35539069b85e2f88084987))
* 修复scrollWidth > offsetWidth判断是否省略不准确问题,可能出现scrollWidth等于offsetWidth实际显示有省略 ([#301](https://github.com/WeBankFinTech/fes-design/issues/301)) ([a680143](https://github.com/WeBankFinTech/fes-design/commit/a680143d9c573cdb6c480cbdb01e72cfdb4abf45))
* 修复编译问题 ([7da9303](https://github.com/WeBankFinTech/fes-design/commit/7da93035da4fbd4a56f4b87906213d11e4d4460d))


### Features

* 卡片组件 ([#304](https://github.com/WeBankFinTech/fes-design/issues/304)) ([199c738](https://github.com/WeBankFinTech/fes-design/commit/199c738e91947f3313589015a155d236916f9ce7))



## [0.7.24](https://github.com/WeBankFinTech/fes-design/compare/v0.7.23...v0.7.24) (2023-04-07)


### Bug Fixes

* **scrollbar:** 修复scrollbar组件在水平滚动时,无法监听内容大小变化问题 ([#299](https://github.com/WeBankFinTech/fes-design/issues/299)) ([5ec94bc](https://github.com/WeBankFinTech/fes-design/commit/5ec94bce267030c2bc4855894b982bfe2588c261))



## [0.7.23](https://github.com/WeBankFinTech/fes-design/compare/v0.7.22...v0.7.23) (2023-03-22)


### Bug Fixes

* **tooltip:** 修复处理popperClass不正确问题 ([#291](https://github.com/WeBankFinTech/fes-design/issues/291)) ([b3131d4](https://github.com/WeBankFinTech/fes-design/commit/b3131d43054b6931d476256d0ae86f7556613f22))
* 修复 popper trigger 纯文本节点导致异常 ([#295](https://github.com/WeBankFinTech/fes-design/issues/295)) ([b41e58c](https://github.com/WeBankFinTech/fes-design/commit/b41e58c87f866d51b39acfce50e6e5a6c6b744fc))


### Features

* form支持inlineItemGap属性 ([#296](https://github.com/WeBankFinTech/fes-design/issues/296)) ([0f97c14](https://github.com/WeBankFinTech/fes-design/commit/0f97c14dcb4d5508fd9c32720d0c83017c4296c9))



## [0.7.22](https://github.com/WeBankFinTech/fes-design/compare/v0.7.21...v0.7.22) (2023-03-20)


### Bug Fixes

* 修复类型异常 ([#290](https://github.com/WeBankFinTech/fes-design/issues/290)) ([3ff05dd](https://github.com/WeBankFinTech/fes-design/commit/3ff05dddc327a9ee13245ef35372c6fba82cdaf6))



## [0.7.21](https://github.com/WeBankFinTech/fes-design/compare/v0.7.20...v0.7.21) (2023-03-09)


### Bug Fixes

* 修复 maxRange 问题 ([#287](https://github.com/WeBankFinTech/fes-design/issues/287)) ([047a1e3](https://github.com/WeBankFinTech/fes-design/commit/047a1e3b61f062b3145716d2e7a5817a0cf429c9))
* 修复date-picker 和 time-picker 弹窗问题 ([#286](https://github.com/WeBankFinTech/fes-design/issues/286)) ([ccdc479](https://github.com/WeBankFinTech/fes-design/commit/ccdc4798ca629784287399a5e5d43bb77656ee25))



## [0.7.20](https://github.com/WeBankFinTech/fes-design/compare/v0.7.19...v0.7.20) (2023-03-03)


### Features

* form组件新增disabled能力 ([#280](https://github.com/WeBankFinTech/fes-design/issues/280)) ([6d14f8a](https://github.com/WeBankFinTech/fes-design/commit/6d14f8a9c890f2326531eb6dfd8fdcdc289cbdc7))
* Menu组件的expandKeys支持双向绑定 ([#281](https://github.com/WeBankFinTech/fes-design/issues/281)) ([45d2040](https://github.com/WeBankFinTech/fes-design/commit/45d20403d5064a21912ac9346665faacf12cadaa))
* modal 添加 esc 快捷键 ([#282](https://github.com/WeBankFinTech/fes-design/issues/282)) ([aca2fbe](https://github.com/WeBankFinTech/fes-design/commit/aca2fbecd3d6255191a6cd7351902a4c41d9536f))
* Select组件支持empty插槽 ([#279](https://github.com/WeBankFinTech/fes-design/issues/279)) ([c839675](https://github.com/WeBankFinTech/fes-design/commit/c839675ae78cc63ecb57d2341fc3d49da5d838dc))



## [0.7.19](https://github.com/WeBankFinTech/fes-design/compare/v0.7.18...v0.7.19) (2023-02-13)


### Bug Fixes

* 修复虚拟滚动组件scrollToBottom问题 ([#276](https://github.com/WeBankFinTech/fes-design/issues/276)) ([5f0d557](https://github.com/WeBankFinTech/fes-design/commit/5f0d557e8705fc490d232295a87feb1a49c50912))
* 避免Table组件当bodyWrapper叠加scrollbar时高度为100%可能计算出错误高度 ([#278](https://github.com/WeBankFinTech/fes-design/issues/278)) ([dd0c687](https://github.com/WeBankFinTech/fes-design/commit/dd0c687f7009a758e19ff4fa89d0ec56216f669d))


### Features

* Image预览挂载 & Modal全局配置 ([#277](https://github.com/WeBankFinTech/fes-design/issues/277)) ([950474c](https://github.com/WeBankFinTech/fes-design/commit/950474cf47f9662f0ad27fc0065d0b39a6e47b75))
* Select组件中自定义选项添加标记 ([#275](https://github.com/WeBankFinTech/fes-design/issues/275)) ([300d982](https://github.com/WeBankFinTech/fes-design/commit/300d982c0b27332b0b5a5c3da8628022362aa88c))



## [0.7.18](https://github.com/WeBankFinTech/fes-design/compare/v0.7.17...v0.7.18) (2023-02-02)


### Bug Fixes

* skeleton源码类型检查OK ([#273](https://github.com/WeBankFinTech/fes-design/issues/273)) ([0c3f0f1](https://github.com/WeBankFinTech/fes-design/commit/0c3f0f197e8269bb240eca2c3680f94f7afd873f))
* 修复Steps组件未处理子组件删减逻辑 ([#271](https://github.com/WeBankFinTech/fes-design/issues/271)) ([b7899c3](https://github.com/WeBankFinTech/fes-design/commit/b7899c3397f9ff9bb629197e405b7f4c7c299716))


### Features

* 优化输入框光标颜色 & Select组件支持输入新选项 & Select组件支持按下enter选择 ([#270](https://github.com/WeBankFinTech/fes-design/issues/270)) ([8fce917](https://github.com/WeBankFinTech/fes-design/commit/8fce917ec189e84641d05ba2844d799e9d9c5ee3))



## [0.7.17](https://github.com/WeBankFinTech/fes-design/compare/v0.7.16...v0.7.17) (2023-01-30)


### Bug Fixes

* 修复Pagination组件未正确处理theme问题 ([dc55c9a](https://github.com/WeBankFinTech/fes-design/commit/dc55c9a507d0d6ed9996d4f1b069141d19f93366))
* 修复Select disabled 时的样式问题 ([#269](https://github.com/WeBankFinTech/fes-design/issues/269)) ([f4112db](https://github.com/WeBankFinTech/fes-design/commit/f4112dbe46b80f40cabf0e8f8a70b404ee095206))



## [0.7.16](https://github.com/WeBankFinTech/fes-design/compare/v0.7.15...v0.7.16) (2023-01-17)


### Bug Fixes

*  Form组件 修复重置功能bug & 支持span 属性 ([#266](https://github.com/WeBankFinTech/fes-design/issues/266)) ([90bd956](https://github.com/WeBankFinTech/fes-design/commit/90bd95637e83f61f0c7c82c64c9d0674bf85e163))
* DatePicker 修复表单样式校验问题 ([#268](https://github.com/WeBankFinTech/fes-design/issues/268)) ([ca31edd](https://github.com/WeBankFinTech/fes-design/commit/ca31edd4954fda0f1aca007f2a94cbfe10051352))
* space空插槽问题 ([#264](https://github.com/WeBankFinTech/fes-design/issues/264)) ([52e9c25](https://github.com/WeBankFinTech/fes-design/commit/52e9c25dfbeaa05e409fba4613a8dc1de5c523f5))
* 可切换trigger ([#265](https://github.com/WeBankFinTech/fes-design/issues/265)) ([80e5b0b](https://github.com/WeBankFinTech/fes-design/commit/80e5b0b85a38e81d86628354f9e263ca2366bdd8))


### Features

* RadioGroup支持按钮组 ([#262](https://github.com/WeBankFinTech/fes-design/issues/262)) ([5edf303](https://github.com/WeBankFinTech/fes-design/commit/5edf303f433e166698d4986c0321d9c2e385358a))



## [0.7.15](https://github.com/WeBankFinTech/fes-design/compare/v0.7.14...v0.7.15) (2023-01-11)


### Features

* 日期选择支持多选 ([#261](https://github.com/WeBankFinTech/fes-design/issues/261)) ([638b792](https://github.com/WeBankFinTech/fes-design/commit/638b792ed5afe6cbffa3e063d166cb9469c37955))
* checkbox&radio新增options支持 ([#263](https://github.com/WeBankFinTech/fes-design/issues/263)) ([85897fd](https://github.com/WeBankFinTech/fes-design/commit/85897fd04d87a26b6bdb1557ad5fcd7a1fc87388))



## [0.7.14](https://github.com/WeBankFinTech/fes-design/compare/v0.7.13...v0.7.14) (2023-01-09)


### Bug Fixes

* 解决 collapse 构建问题 ([#260](https://github.com/WeBankFinTech/fes-design/issues/260)) ([c835bf3](https://github.com/WeBankFinTech/fes-design/commit/c835bf3d55e0432dd941d07447165b38cb2dcafa))



## [0.7.13](https://github.com/WeBankFinTech/fes-design/compare/v0.7.12...v0.7.13) (2023-01-09)


### Features

* table配置个性化配置ellipsis ([#257](https://github.com/WeBankFinTech/fes-design/issues/257)) ([8ec6d84](https://github.com/WeBankFinTech/fes-design/commit/8ec6d8464b0e34ba3cb3e167201a04454454a5b9))
* VirtualList支持配置height和maxHeight ([#259](https://github.com/WeBankFinTech/fes-design/issues/259)) ([480ee19](https://github.com/WeBankFinTech/fes-design/commit/480ee19423824785634c3775c78a536e05a3b587))
* 添加collapse组件 ([#256](https://github.com/WeBankFinTech/fes-design/issues/256)) ([43081c0](https://github.com/WeBankFinTech/fes-design/commit/43081c07e37bcf7aa3116d3b2e49ab59a46474f4))



## [0.7.12](https://github.com/WeBankFinTech/fes-design/compare/v0.7.11...v0.7.12) (2022-12-15)


### Bug Fixes

* 修复 umd 编译问题 ([#255](https://github.com/WeBankFinTech/fes-design/issues/255)) ([e1ca8d4](https://github.com/WeBankFinTech/fes-design/commit/e1ca8d415e5d4e84024387e3cdbdd6b220850dc1))


### Features

* image组件新增预览拖拽查看 ([#254](https://github.com/WeBankFinTech/fes-design/issues/254)) ([f099cdc](https://github.com/WeBankFinTech/fes-design/commit/f099cdcb5a75cda1f260c1b7907afe5389e64f60))



## [0.7.11](https://github.com/WeBankFinTech/fes-design/compare/v0.7.10...v0.7.11) (2022-12-08)


### Bug Fixes

* 循环依赖问题 ([#252](https://github.com/WeBankFinTech/fes-design/issues/252)) ([7859b32](https://github.com/WeBankFinTech/fes-design/commit/7859b3239ee0c209ad8d818a34abccb5561dd01b))


### Features

* Table组件支持empty插槽 ([#251](https://github.com/WeBankFinTech/fes-design/issues/251)) ([eaaace0](https://github.com/WeBankFinTech/fes-design/commit/eaaace0b71641bf11d0245979f4ec6303ed7abf3))



## [0.7.10](https://github.com/WeBankFinTech/fes-design/compare/v0.7.9...v0.7.10) (2022-11-24)


### Features

*  FormItem支持value  & FormItem span 取整 ([#249](https://github.com/WeBankFinTech/fes-design/issues/249)) ([cd10bcb](https://github.com/WeBankFinTech/fes-design/commit/cd10bcbbed79b647480a64465cce678993612490))



## [0.7.9](https://github.com/WeBankFinTech/fes-design/compare/v0.7.8...v0.7.9) (2022-11-17)

### Bug Fixes

* fix: 修复Select组件多选未选择时placeholder样式问题 ([d7e0a3c](https://github.com/WeBankFinTech/fes-design/commit/d7e0a3c))
* feat: Select和SelectTree支持过滤函数 (#248) ([c5625c0](https://github.com/WeBankFinTech/fes-design/commit/c5625c0)), closes [#248](https://github.com/WeBankFinTech/fes-design/issues/248)



## [0.7.8](https://github.com/WeBankFinTech/fes-design/compare/v0.7.7...v0.7.8) (2022-11-07)


### Bug Fixes

* 修复Table组件未设置排序能排序问题 ([#247](https://github.com/WeBankFinTech/fes-design/issues/247)) ([a9001b1](https://github.com/WeBankFinTech/fes-design/commit/a9001b1122df196bb99908eb398ab7d764d4cb4d))


### Features

* date-picker 支持 month range ([#245](https://github.com/WeBankFinTech/fes-design/issues/245)) ([180c0ab](https://github.com/WeBankFinTech/fes-design/commit/180c0abc94ef82a8e326b05af5bb1cdfaf734738))
* form-inline 在formItem新增span属性  &  优化form相关的 ts eslint 规则限制 ([#246](https://github.com/WeBankFinTech/fes-design/issues/246)) ([b7f121d](https://github.com/WeBankFinTech/fes-design/commit/b7f121da953df63585efb69286bc8d82f3a647ce))



## [0.7.7](https://github.com/WeBankFinTech/fes-design/compare/v0.7.6...v0.7.7) (2022-10-31)


### Bug Fixes

* tabs默认选中优化 ([#243](https://github.com/WeBankFinTech/fes-design/issues/243)) ([0721093](https://github.com/WeBankFinTech/fes-design/commit/0721093d4f7a1e27920eaa391c3eb54ff4aa6f70))
* 修复Tree组件手风琴模式问题 ([#244](https://github.com/WeBankFinTech/fes-design/issues/244)) ([6d0d42b](https://github.com/WeBankFinTech/fes-design/commit/6d0d42b70b61076f36ba9be8b18a36e9a428eab2))



## [0.7.6](https://github.com/WeBankFinTech/fes-design/compare/v0.7.5...v0.7.6) (2022-10-28)


### Bug Fixes

* Cascader组件自定义选项配置不生效 ([#239](https://github.com/WeBankFinTech/fes-design/issues/239)) ([b2f7a49](https://github.com/WeBankFinTech/fes-design/commit/b2f7a49653c227b3f6b88a1e5f203c5d736655d2))
* config provide getContainer 没给默认值异常 ([#232](https://github.com/WeBankFinTech/fes-design/issues/232)) ([cc9ad30](https://github.com/WeBankFinTech/fes-design/commit/cc9ad301b8b97017784db369825dacd57cb0c432))
* datePicker maxRange 移除 M/Y 的支持 ([#236](https://github.com/WeBankFinTech/fes-design/issues/236)) ([c8a1156](https://github.com/WeBankFinTech/fes-design/commit/c8a1156768017c1159e12015332eb13925afbfe6))
* datePicker range 样式问题 ([#238](https://github.com/WeBankFinTech/fes-design/issues/238)) ([9a9b0c9](https://github.com/WeBankFinTech/fes-design/commit/9a9b0c97ac6e64a9e54a4ecde83a7b1516ea95d6))
* 修复Table无数据时会全选问题 ([b317bec](https://github.com/WeBankFinTech/fes-design/commit/b317becfe6b4adc059c711e2fc8c05dd90e5e9ef))
* 修复Table组件开关draggable不起作用 ([#241](https://github.com/WeBankFinTech/fes-design/issues/241)) ([15ff82e](https://github.com/WeBankFinTech/fes-design/commit/15ff82ea9f23b10be10e331d1abf4d35ef8a00cc))


### Features

* Table支持排序 ([#240](https://github.com/WeBankFinTech/fes-design/issues/240)) ([ed51a99](https://github.com/WeBankFinTech/fes-design/commit/ed51a991f019045f609846badb60cc349024cde0))



## [0.7.5](https://github.com/WeBankFinTech/fes-design/compare/v0.7.4...v0.7.5) (2022-10-20)


### Bug Fixes

* 修复Select组件v-model未初始化+多选导致内部状态不同步更新到组件外问题 ([#235](https://github.com/WeBankFinTech/fes-design/issues/235)) ([9efaa1f](https://github.com/WeBankFinTech/fes-design/commit/9efaa1f0092fd0d5e7ac628a7deef01df74d5233))



## [0.7.4](https://github.com/WeBankFinTech/fes-design/compare/v0.7.3...v0.7.4) (2022-10-18)


### Bug Fixes

* draggable指令兼容只有updated场景 ([#234](https://github.com/WeBankFinTech/fes-design/issues/234)) ([a9371f8](https://github.com/WeBankFinTech/fes-design/commit/a9371f80ce82c7239c47ab1d0c51047ff97bd2bb))
* table actionType 类型问题 ([#230](https://github.com/WeBankFinTech/fes-design/issues/230)) ([0f77018](https://github.com/WeBankFinTech/fes-design/commit/0f770186fe6ed7ce71326b971bc76107584ce9c1))



## [0.7.3](https://github.com/WeBankFinTech/fes-design/compare/v0.7.2...v0.7.3) (2022-09-29)


### Bug Fixes

* Date-picker 默认时间范围00:00:00-23:59:59 ([#228](https://github.com/WeBankFinTech/fes-design/issues/228)) ([9beaf1f](https://github.com/WeBankFinTech/fes-design/commit/9beaf1ff1c23e7c81ebd5561b76cc3650d00b77c))
* 修复useNormalModel可能丢失响应性问题 ([#229](https://github.com/WeBankFinTech/fes-design/issues/229)) ([ba696a7](https://github.com/WeBankFinTech/fes-design/commit/ba696a7c3d8eeadccd9ad7738aa8f1aa1e239bbb))



## [0.7.2](https://github.com/WeBankFinTech/fes-design/compare/v0.7.1...v0.7.2) (2022-09-26)


### Bug Fixes

* Table在处理rowkey时抛出异常 ([0daaafa](https://github.com/WeBankFinTech/fes-design/commit/0daaafaff3dab813c8f78da31a62e05962047de2))
* 修复Table多选后切换数据显示未全选问题 & 修复Table把number的rowkey处理成string问题 ([e98db73](https://github.com/WeBankFinTech/fes-design/commit/e98db732bc89ea0943a6eb661e56dc09bf3fff6b))
* 完善细节 ([601fcd5](https://github.com/WeBankFinTech/fes-design/commit/601fcd5e2d9247beaa815a76c2db6a23430baf88))


### Features

* Table提供checkedKeys配置 ([5edb855](https://github.com/WeBankFinTech/fes-design/commit/5edb85593ed49357f5abaab5209460beef5ccc41))
* Table支持配置expandedKeys ([7e30aaa](https://github.com/WeBankFinTech/fes-design/commit/7e30aaad38c0cc32af6eeabbca043e32b1dc7e2f))



## [0.7.1](https://github.com/WeBankFinTech/fes-design/compare/v0.7.0...v0.7.1) (2022-09-21)



# [0.7.0](https://github.com/WeBankFinTech/fes-design/compare/v0.6.4...v0.7.0) (2022-09-07)


### Bug Fixes

* 修复select多选时过滤文本展示不全的问题 ([#219](https://github.com/WeBankFinTech/fes-design/issues/219)) ([1b3f95e](https://github.com/WeBankFinTech/fes-design/commit/1b3f95eb3cd19a774ea35dd2f10eb076363f89cf))
* flatten节点会配置Fragment包裹节点的key,避免出现渲染异常 ([#218](https://github.com/WeBankFinTech/fes-design/issues/218)) ([f7a42b3](https://github.com/WeBankFinTech/fes-design/commit/f7a42b3bd6758fe411254d4158bbb7140fa107de))


### Features

* 添加 descritions 描述组件 ([#223](https://github.com/WeBankFinTech/fes-design/issues/223)) ([8092767](https://github.com/WeBankFinTech/fes-design/commit/809276713e1dd4d509aa4640e978f07bacb902db))
* draggable组件新增beforeDragEnd、dragStart事件、dragEnd事件 ([69f6dff](https://github.com/WeBankFinTech/fes-design/commit/69f6dff0e24457bc27a07ad3877f949ebb856c4a))
* table支持拖拽 ([#222](https://github.com/WeBankFinTech/fes-design/issues/222)) ([5e53a5b](https://github.com/WeBankFinTech/fes-design/commit/5e53a5b00ea73f6cd9e3b94558f4dfe0058f08b4))



## [0.6.4](https://github.com/WeBankFinTech/fes-design/compare/v0.6.3...v0.6.4) (2022-08-24)


### Bug Fixes

* 修复selectTree默认值不显示问题 ([#217](https://github.com/WeBankFinTech/fes-design/issues/217)) ([be8e808](https://github.com/WeBankFinTech/fes-design/commit/be8e808105e0035d41e07794131bbcc4974d5589))



## [0.6.3](https://github.com/WeBankFinTech/fes-design/compare/v0.6.2...v0.6.3) (2022-08-18)


### Bug Fixes

* 修复table渲染问题 ([#216](https://github.com/WeBankFinTech/fes-design/issues/216)) ([6eb00c6](https://github.com/WeBankFinTech/fes-design/commit/6eb00c66d0a35d37e722e8d6c07c2461b0adce14))



## [0.6.2](https://github.com/WeBankFinTech/fes-design/compare/v0.6.1...v0.6.2) (2022-08-16)


### Bug Fixes

* 修复Select组件切换选项时选项超长文本省略不生效问题 ([acd95b4](https://github.com/WeBankFinTech/fes-design/commit/acd95b4401843452e4425001c88af1a1fa382b7a))


### Features

* Popper的disabled提供函数 & 重构ellipsis实现方式 ([9176aba](https://github.com/WeBankFinTech/fes-design/commit/9176aba7a31b7c515a1a912e8034eac08acc1b92))



## [0.6.1](https://github.com/WeBankFinTech/fes-design/compare/v0.6.0...v0.6.1) (2022-08-15)


### Features

* RadioGroup可配置是否取消选项 ([#213](https://github.com/WeBankFinTech/fes-design/issues/213)) ([5c48ba5](https://github.com/WeBankFinTech/fes-design/commit/5c48ba5c533b3aa5858b2304638ec70ff961703e))
* Select/SelectTree/SelectCascader/DatePicker/TimePicker支持配置class和style ([#214](https://github.com/WeBankFinTech/fes-design/issues/214)) ([048391d](https://github.com/WeBankFinTech/fes-design/commit/048391d13a1c0742d89e95cfe9bc5b6065341208))



# [0.6.0](https://github.com/WeBankFinTech/fes-design/compare/v0.5.22...v0.6.0) (2022-08-11)



## [0.5.22](https://github.com/WeBankFinTech/fes-design/compare/v0.5.21...v0.5.22) (2022-08-11)


### Bug Fixes

* clearSelection清除全部选中数据 ([#210](https://github.com/WeBankFinTech/fes-design/issues/210)) ([bd1ae14](https://github.com/WeBankFinTech/fes-design/commit/bd1ae147d1ec201c1f4151e9bfa7e875b7639bbc))
* 修复Tree组件checkedKeys默认值无效问题 ([#212](https://github.com/WeBankFinTech/fes-design/issues/212)) ([c227483](https://github.com/WeBankFinTech/fes-design/commit/c227483ce9cb91c3b2d6f493e107a45b35a065be))
* 修复代码格式问题 ([#209](https://github.com/WeBankFinTech/fes-design/issues/209)) ([b7bbee3](https://github.com/WeBankFinTech/fes-design/commit/b7bbee37ec39582fa06a7c3a191cc3416d69aecf))



## [0.5.21](https://github.com/WeBankFinTech/fes-design/compare/v0.5.20...v0.5.21) (2022-08-05)


### Bug Fixes

* 优化Tree展开收起性能 ([#208](https://github.com/WeBankFinTech/fes-design/issues/208)) ([804a613](https://github.com/WeBankFinTech/fes-design/commit/804a6134545c493246f6fa05233b3de19939faa4))



## [0.5.20](https://github.com/WeBankFinTech/fes-design/compare/v0.5.19...v0.5.20) (2022-08-04)


### Bug Fixes

* scrollbar监听最外层容器大小变化而重新计算滚动条 ([#206](https://github.com/WeBankFinTech/fes-design/issues/206)) ([07a201c](https://github.com/WeBankFinTech/fes-design/commit/07a201c44da84d5cd9768a7f1bad032ca8e933eb))
* 优化Tree大数据下的性能问题 & 父子关联模式下不兼容valueField问题 ([#207](https://github.com/WeBankFinTech/fes-design/issues/207)) ([c57cb7f](https://github.com/WeBankFinTech/fes-design/commit/c57cb7f1286943d2fd5f90ecb6911c83664e94f7))



## [0.5.19](https://github.com/WeBankFinTech/fes-design/compare/v0.5.18...v0.5.19) (2022-07-28)


### Bug Fixes

* 修复table样式问题 ([#204](https://github.com/WeBankFinTech/fes-design/issues/204)) ([b9d507d](https://github.com/WeBankFinTech/fes-design/commit/b9d507ddc5698a3efd3df6d852c6838816c9a9f8))
* 修复垂直步骤条样式问题 ([#203](https://github.com/WeBankFinTech/fes-design/issues/203)) ([e9c89b4](https://github.com/WeBankFinTech/fes-design/commit/e9c89b48d6335399cc4c5baa76b15e27717ed626))


### Features

* select支持配置弹窗样式 ([#205](https://github.com/WeBankFinTech/fes-design/issues/205)) ([ac3159d](https://github.com/WeBankFinTech/fes-design/commit/ac3159d46ebf2e58270df557cc0c745cfbc90d84))



## [0.5.18](https://github.com/WeBankFinTech/fes-design/compare/v0.5.17...v0.5.18) (2022-07-18)


### Bug Fixes

* datePicker 手动输入 disable 限制问题 ([#200](https://github.com/WeBankFinTech/fes-design/issues/200)) ([010f169](https://github.com/WeBankFinTech/fes-design/commit/010f1696af7b563c11dae921664b277806a2000f))



## [0.5.17](https://github.com/WeBankFinTech/fes-design/compare/v0.5.16...v0.5.17) (2022-07-14)


### Features

* Table在某些场景下支持列按照内容分配宽度 ([#199](https://github.com/WeBankFinTech/fes-design/issues/199)) ([9525f03](https://github.com/WeBankFinTech/fes-design/commit/9525f03d61b262f7ecfba0aa193a5dd7f6fd0770))



## [0.5.16](https://github.com/WeBankFinTech/fes-design/compare/v0.5.15...v0.5.16) (2022-07-11)


### Features

* draggable slot 暴露 index ([#197](https://github.com/WeBankFinTech/fes-design/issues/197)) ([9c0eea8](https://github.com/WeBankFinTech/fes-design/commit/9c0eea8470f4e174f37643e530c490d0d028804d))



## [0.5.15](https://github.com/WeBankFinTech/fes-design/compare/v0.5.14...v0.5.15) (2022-07-05)


### Bug Fixes

* 修复Select等组件多选时gap样式兼容性差问题 ([#195](https://github.com/WeBankFinTech/fes-design/issues/195)) ([29ea579](https://github.com/WeBankFinTech/fes-design/commit/29ea579fb747019cf95fe30a5d7e2b5aea486437))
* datePicker range 样式问题 ([#194](https://github.com/WeBankFinTech/fes-design/issues/194)) ([01dad24](https://github.com/WeBankFinTech/fes-design/commit/01dad24a808c36d8f7815cc689e2eeb0582ab672))



## [0.5.14](https://github.com/WeBankFinTech/fes-design/compare/v0.5.13...v0.5.14) (2022-06-29)


### Bug Fixes

* form label font-size 异常 ([#193](https://github.com/WeBankFinTech/fes-design/issues/193)) ([7c4ea9d](https://github.com/WeBankFinTech/fes-design/commit/7c4ea9d5f2fe9e427eec97e83a99a8b0d791ac8f))
* inline-form grid 布局自适应换行 ([#190](https://github.com/WeBankFinTech/fes-design/issues/190)) ([f7ee251](https://github.com/WeBankFinTech/fes-design/commit/f7ee251248f463c2dd32b1415c6ae29528e5a9e9))
* input-number 小数点后面不能输入0 ([#191](https://github.com/WeBankFinTech/fes-design/issues/191)) ([8ee926d](https://github.com/WeBankFinTech/fes-design/commit/8ee926d8c42d2b0d93a4793ee9100897f0d02133))



## [0.5.13](https://github.com/WeBankFinTech/fes-design/compare/v0.5.12...v0.5.13) (2022-06-23)


### Bug Fixes

* Pagaintion组件按钮加入默认padding ([#187](https://github.com/WeBankFinTech/fes-design/issues/187)) ([1605d04](https://github.com/WeBankFinTech/fes-design/commit/1605d04ea538865a4b70dbc5ccbaf6baa628ae82))


### Features

* Upload添加tansformResponse处理请求和timeout配置 ([#189](https://github.com/WeBankFinTech/fes-design/issues/189)) ([0825218](https://github.com/WeBankFinTech/fes-design/commit/0825218bb74fff5988504da933068b9df1b1284f))



## [0.5.12](https://github.com/WeBankFinTech/fes-design/compare/v0.5.11...v0.5.12) (2022-06-20)


### Bug Fixes

* 修复Upload拖拽上传未配置accpet都会被拦截问题 ([c5c123d](https://github.com/WeBankFinTech/fes-design/commit/c5c123d6c12f4913ce9c13e85ad14b6965e69600))
* 修复多级表头无法正确显示问题 ([#185](https://github.com/WeBankFinTech/fes-design/issues/185)) ([cbc763d](https://github.com/WeBankFinTech/fes-design/commit/cbc763d99c7af241011f1317bbd2cbc61dbe86bd))



## [0.5.11](https://github.com/WeBankFinTech/fes-design/compare/v0.5.10...v0.5.11) (2022-06-17)


### Bug Fixes

* Table全选在数据改变后不更新 ([#183](https://github.com/WeBankFinTech/fes-design/issues/183)) ([3ca7cee](https://github.com/WeBankFinTech/fes-design/commit/3ca7cee33d850ddd3f572e1de21b046ce39d9236))
* 修复超出1W数据时过滤Tree卡顿问题 ([#182](https://github.com/WeBankFinTech/fes-design/issues/182)) ([295d68d](https://github.com/WeBankFinTech/fes-design/commit/295d68d73a64b2fc7869e1cf06a646e9b48abee3))


### Features

* upload支持拖拽上传 ([#181](https://github.com/WeBankFinTech/fes-design/issues/181)) ([a5d8adc](https://github.com/WeBankFinTech/fes-design/commit/a5d8adc169c020397274cec08796e770ac2774fd))



## [0.5.10](https://github.com/WeBankFinTech/fes-design/compare/v0.5.9...v0.5.10) (2022-06-13)


### Bug Fixes

* grid组件gutter样式 ([#175](https://github.com/WeBankFinTech/fes-design/issues/175)) ([9349c78](https://github.com/WeBankFinTech/fes-design/commit/9349c78ae2b0138a6f5e3cde3ca740e6af1b79ac))
* 修复table滚动时shadow 样式被固定列覆盖问题 ([#174](https://github.com/WeBankFinTech/fes-design/issues/174)) ([f58b7b8](https://github.com/WeBankFinTech/fes-design/commit/f58b7b8eb3353d595fd6e4869fe2bd12ec467545))
* 将 enum 属性改成字符串，避免使用组件时类型提示异常 ([#180](https://github.com/WeBankFinTech/fes-design/issues/180)) ([9b8385e](https://github.com/WeBankFinTech/fes-design/commit/9b8385e11e1bc00e5279aebce3d2734d15c66512))


### Features

* Ellipsis添加content属性，能文本变化从而更新省略 ([#178](https://github.com/WeBankFinTech/fes-design/issues/178)) ([98332cc](https://github.com/WeBankFinTech/fes-design/commit/98332cc3b1e3e5df0dcc1bb793eecddf824e294b))
* tag支持bordered配置项及多选项展示样式优化 ([#176](https://github.com/WeBankFinTech/fes-design/issues/176)) ([cee3a7d](https://github.com/WeBankFinTech/fes-design/commit/cee3a7d02ed93582cb0b25a616085a2e91088ce2))
* Tree支持拖拽 ([#177](https://github.com/WeBankFinTech/fes-design/issues/177)) ([e47a232](https://github.com/WeBankFinTech/fes-design/commit/e47a232d2ef6177ee908b65a4555e0e84a0fd685))



## [0.5.9](https://github.com/WeBankFinTech/fes-design/compare/v0.5.8...v0.5.9) (2022-05-31)


### Bug Fixes

* **datepicker:** type ([#171](https://github.com/WeBankFinTech/fes-design/issues/171)) ([0e5788c](https://github.com/WeBankFinTech/fes-design/commit/0e5788c7d947b6f64295fd0904961f8865024cc1))


### Features

* date-picker 添加 defaultTime ([#172](https://github.com/WeBankFinTech/fes-design/issues/172)) ([2eca7be](https://github.com/WeBankFinTech/fes-design/commit/2eca7bed12ea63316011eac1eee354fe9f11b7d3))



## [0.5.8](https://github.com/WeBankFinTech/fes-design/compare/v0.5.7...v0.5.8) (2022-05-30)


### Bug Fixes

*  Select修复slot 不在render中执行的问题 ([#167](https://github.com/WeBankFinTech/fes-design/issues/167)) ([3d97700](https://github.com/WeBankFinTech/fes-design/commit/3d9770024adaf6f69b97c1dd1d36101d14c7071c))
* date-picker 时间初始化问题 ([#170](https://github.com/WeBankFinTech/fes-design/issues/170)) ([78b9eee](https://github.com/WeBankFinTech/fes-design/commit/78b9eee07a7a1fb655bda7a5e016a6736b6104cf))
* dragable 指令引发 vue 组件渲染异常 ([#168](https://github.com/WeBankFinTech/fes-design/issues/168)) ([1f0713e](https://github.com/WeBankFinTech/fes-design/commit/1f0713ecd0df88c5e7b2b6d379cbb0b2a95245ff))
* tabPane为空时正常显示 ([#169](https://github.com/WeBankFinTech/fes-design/issues/169)) ([fbd9b7f](https://github.com/WeBankFinTech/fes-design/commit/fbd9b7f9727d99c789e35678c58b13351fe94d84))



## [0.5.7](https://github.com/WeBankFinTech/fes-design/compare/v0.5.6...v0.5.7) (2022-05-25)


### Features

* Image预览图片大小不会超过可视区域 ([#166](https://github.com/WeBankFinTech/fes-design/issues/166)) ([d7d67da](https://github.com/WeBankFinTech/fes-design/commit/d7d67dac42edc4e70becc4e17f37880aa9995204))



## [0.5.6](https://github.com/WeBankFinTech/fes-design/compare/v0.5.5...v0.5.6) (2022-05-24)


### Bug Fixes

* 异步加载兼容无子节点的场景 ([#163](https://github.com/WeBankFinTech/fes-design/issues/163)) ([97d7402](https://github.com/WeBankFinTech/fes-design/commit/97d74029083d20135683192e0034530328bb0ce1))



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



