
module.exports = {
    moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'vue',
    ],
    transform: {
        '\\.[jt]sx?$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
                'jest-transform-stub',
    },
    moduleDirectories: [
        'node_modules',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!lodash-es)',
    ],
};
