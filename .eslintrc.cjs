module.exports = {
	root: true,
	extends: ['@nuxt/eslint-config'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'off',
		'vue/html-indent': ['error', 'tab'],
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
				ignoredNodes: ['ConditionalExpression'],
			},
		],
		'no-case-declarations': 'off',
		'vue/max-attributes-per-line': 'off',
		'vue/multi-word-component-names': 'off',
		'vue/attributes-order': 'off',
		'vue/no-reserved-component-names': 'off',
		'vue/require-default-prop': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/html-self-closing': 'off',
		'vue/attribute-hyphenation': 'off',
		'vue/no-unused-vars': 'off',
		'no-async-promise-executor': 'off',
		'vue/no-template-shadow': 'off',
	},
}
