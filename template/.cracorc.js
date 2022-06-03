const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
require("dotenv").config();

const deps = require("./package.json").dependencies;

module.exports = () => ({
    devServer: {
        port: {{PORT}},
        historyApiFallback: true,
    },
    webpack: {
        configure: {
            output: {
                publicPath: "auto",
                clean: true,
            },
            module: {
                rules: [
                    {
                        test: /\.(ts|tsx|jsx|js)x?$/,
                        use: {
                            loader: 'ts-loader'
                        },
                        exclude: /node_modules/,
                    },
                ],
            },
        },
        plugins: {
            add: [
                new HtmlWebpackPlugin({
                    template: "./public/index.html",
                    chunks:["main"]
                }),
                new ModuleFederationPlugin({
                    name: {{PROJECT_NAME}},
                    filename: "remoteEntry.js",
                    remotes: {
                        /*
                           Play: `Play@${process.env.REACT_APP_REMOTE_HOST || 'http://localhost:3001'}/remoteEntry.js`,
                        */
                    },
                    exposes: {
                        /*
                            "./Play": "./src/Play",
                        */
                    },
                    shared: {
                        ...deps,
                        ui: { singleton: true },
                        react: {
                            singleton: true,
                            eager: true,
                            requiredVersion: deps.react,
                        },
                        "react-dom": {
                            singleton: true,
                            eager: true,
                            requiredVersion: deps["react-dom"],
                        },
                    },
                }),
            ],
            remove: ["HtmlWebpackPlugin"],
        },
    },
});
