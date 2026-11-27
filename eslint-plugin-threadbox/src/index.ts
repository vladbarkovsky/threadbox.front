import type { TSESLint } from '@typescript-eslint/utils';
import explicitType = require('./rules/explicit-type');

const plugin: TSESLint.Linter.Plugin = {
	rules: {
		'explicit-type': explicitType,
	},
};

export = plugin;
