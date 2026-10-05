// 诊断用空 setup 文件：曾配合临时 vitest config（setupFiles 指向本文件、
// 其余与 vitest.config.ts 相同）复跑 #1018，确认在【不加载】vitest.setup.ts
// （其 mock 了 getBoundingClientRect）的环境下同样不出现 recursive updates，
// 即「无递归」结论不是被该 mock 掩盖的假阴性。临时 config 已删除。
// 本文件不匹配 *.spec.ts 收集规则，不会被当作测试执行。
export {};
