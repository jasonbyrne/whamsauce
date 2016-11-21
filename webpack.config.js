module.exports = {
    entry: [
        "./src/exception.ts",
        "./src/promise.ts",
        "./src/load.ts",
        "./src/rule.ts",
        "./src/router.ts",
        "./src/controller.ts",
        "./src/component.ts"
    ],
    output: {
        filename: "public/app/whamsauce.js",
        libraryTarget: "var",
        library: "Whamsauce"
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}