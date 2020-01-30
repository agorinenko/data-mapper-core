module.exports = {
    verbose: true,
    transform: {
        '^.+\\.(ts|html)$': 'ts-jest',
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: ['node_modules/(?!@agm)']
};
