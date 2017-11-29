const path = require('path');
const file=require('./file/file.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';

let entrys=file.getAllFiles(path.resolve(__dirname, 'src/js/'));

console.log(entrys)


if(entrys.length){
	entrys=entrys.map((v,k)=>{
		return './src/js/components/'+v;
	})
}

console.log("environment: " + process.env.NODE_ENV)


module.exports = {
	entry: entrys,
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: 'build/', //虚拟目录，自动指向path编译目录('www/build'),html中引用js文件时，必须引用此虚拟路径
		filename: 'skeleton.js'
	},
	// 开启source-map
	devtool: isDev ? 'eval-source-map' : 'cheap-module-source-map',

	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{ loader: 'postcss-loader' }
				]
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
				}, {
					loader: "css-loader" // translates CSS into CommonJS
				}, {
					loader: 'postcss-loader' //autoprefixer
				}, {
					loader: "sass-loader" // compiles Sass to CSS
				}]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.css', '.scss'],
	},

	plugins: [
		new CleanWebpackPlugin(path.resolve(__dirname, 'build')),
		new HtmlwebpackPlugin({
			title: 'skeleton',
			template: './src/template/index.html',
			filename: '../index.html',//相对于webpackConfig.output.path
			hash: true
		})
	],
}      