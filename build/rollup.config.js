// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
	input: '../src/modules/modal.js',
	output: {
		file: '../www/build/js/skeleton.js',
		format: 'iife',
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**' // 只编译我们的源代码
			})
		]
	}
}