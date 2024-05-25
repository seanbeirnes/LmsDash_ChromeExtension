import terser from "@rollup/plugin-terser";

const isProduction = process.env.NODE_ENV === 'production';

export default {
	input: 'src/ContentScript/main.js',
	output: {
		file: 'dist/src/ContentScript/index.js',
		format: 'iife'
	},
    plugins: isProduction ? [terser()] : []
};