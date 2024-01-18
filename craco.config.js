// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// eslint-disable-next-line import/no-extraneous-dependencies
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	webpack: {
		configure: {
			optimization: {
				runtimeChunk: false,
			},
			plugins: [
				new webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 1,
				}),
				// new BundleAnalyzerPlugin(),
				new CompressionPlugin(),
			],
			output: {
				filename: 'main.js',
				chunkFilename: 'kek.js',
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				loader: 'css-loader',
				options: {
					esModule: false,
				},
			},
			// {
			// 	test: /\.scss$/i,
			// 	loader: 'sass-loader',
			// 	options: {
			// 		esModule: false,
			// 	},
			// },
		],
		
	},
};
