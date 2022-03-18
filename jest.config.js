module.exports = {
    moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'json', 'vue'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            'jest-transform-stub',
    },
    moduleDirectories: ['node_modules'],
    transformIgnorePatterns: [`/node_modules/`],
    moduleNameMapper: {
        '^lodash-es$': 'lodash',
    },
    testEnvironment: 'jsdom',
};
