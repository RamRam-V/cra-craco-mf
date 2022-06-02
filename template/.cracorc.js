const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

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
                    remotes:{},
                    exposes: {},
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
