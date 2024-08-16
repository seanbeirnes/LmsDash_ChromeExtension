import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";

const isProduction = process.env.NODE_ENV === 'production';

export default {
	input: 'src/ContentScript/main.js',
	output: {
		file: 'dist/src/ContentScript/index.js',
		format: 'iife'
	},
    plugins: [replace({
			'process.env.NODE_ENV': () => isProduction ? JSON.stringify('production') : JSON.stringify('development'),
			__dirname: (id) => isProduction ? `''` : `'${id}'`
		}),
			isProduction && terser()]
};