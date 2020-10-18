const path =  require("path");
const DIST_PATH = path.resolve(__dirname, './dist');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');




module.exports = {
    entry: './src/public/mig-app-root.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    optimization:{
        splitChunks:{
            cacheGroups:{
                threejs:{ test: /[\\/]node_modules[\\/]((three).*)[\\/]/, name:'threejs', chunks:'all' }
            }
        }
    },
    module:{
        rules:[
            {
                test: /\.ts$/,
                use:'ts-loader',
                include:[path.resolve(__dirname, 'src/public')]
            }
        ]
    },
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname, 'dist'),
		publicPath: '/dist/'
    },
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebPackPlugin({
			template: "./src/public/index.html",
			filename: "./index.html",
			inject:true
		}),
		new CopyWebpackPlugin({
            patterns: [
                { from: './src/public/assets', to: './assets' }
            ]
        })
  	]
}