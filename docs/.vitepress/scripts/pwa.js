exports.pwa = () => {
    return {
        outDir: '.vitepress/dist', // 输出目录
        registerType: 'autoUpdate', // 注册类型为自动更新
        includeManifestIcons: false, // 不包含清单图标
        workbox: {
            maximumFileSizeToCacheInBytes: 1024 * 1024 * 6, // 默认是 1024 * 1024 * 2
            globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'], // 匹配需要缓存的文件类型
            runtimeCaching: [],
        },
    };
};
