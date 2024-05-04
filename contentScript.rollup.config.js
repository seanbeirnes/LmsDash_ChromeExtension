import terser from "@rollup/plugin-terser";

export default {
	input: 'src/ContentScript/main.js',
	output: {
		file: 'dist/src/ContentScript/index.js',
		format: 'iife'
	},
    plugins: [terser()]
};