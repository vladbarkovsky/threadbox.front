import type { TSESLint } from '@typescript-eslint/utils';
import explicitType = require('./rules/explicit-type');

const plugin: TSESLint.Linter.Plugin = {
	rules: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'explicit-type': explicitType,
	},
};

export = plugin;
