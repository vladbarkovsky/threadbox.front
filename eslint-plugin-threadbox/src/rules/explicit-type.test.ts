import { createRequire } from 'module';
import { equal } from 'node:assert/strict';
import { Linter, RuleTester } from 'eslint';
import type { Rule } from 'eslint';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import explicitType = require('./explicit-type');
import { MessageIdentifiers } from './message-identifiers.enum.js';

const nodeRequire: ReturnType<typeof createRequire> = createRequire(__filename);
const rule: Rule.RuleModule = explicitType as unknown as Rule.RuleModule;
const typescriptEslintParser: Linter.ParserModule = nodeRequire('@typescript-eslint/parser') as Linter.ParserModule;

const ruleTester: RuleTester = new RuleTester({
	parser: nodeRequire.resolve('@typescript-eslint/parser'),
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
});

ruleTester.run('explicit-type', rule, {
	valid: [
		'const count: number = 1;',
		'let label: string;',
		'const run = (): void => {};',
		'const run = async (): Promise<void> => {};',
		'const run = function (): void {};',
		'const { name }: User = user;',
		'const [first]: string[] = items;',
		'for (const item of items) {}',
		'for (const key in record) {}',
		'class Box { value: number = 1; }',
		'class Box { run = (): void => {}; }',
		'class Box { handler = function (): void {}; }',
		'class Box { accessor value: number = 1; }',
		'class Box { #value: number = 1; }',
		'function run(count: number): void {}',
		'function run(count: number = 1): void {}',
		'function run(count?: number): void {}',
		'function run(...values: string[]): void {}',
		'const run = (count: number): void => {};',
		'class Box { run(count: number): void {} }',
		'class Box { constructor(private readonly count: number) {} }',
		'interface User { name: string; }',
		'interface User { [key: string]: string; }',
		'type Run = (count: number) => void;',
	],
	invalid: [
		{
			code: 'const count = 1;',
			output: 'const count: number = 1;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: `const label = 'text';`,
			output: `const label: string = 'text';`,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'label' } }],
		},
		{
			code: 'const enabled = false;',
			output: 'const enabled: boolean = false;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'enabled' } }],
		},
		{
			code: 'const count = -1;',
			output: 'const count: number = -1;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: 'const count = 1n;',
			output: 'const count: bigint = 1n;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: 'const count = -1n;',
			output: 'const count: bigint = -1n;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: 'const empty = null;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'empty' } }],
		},
		{
			code: 'const missing = undefined;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'missing' } }],
		},
		{
			code: 'const label = `text`;',
			output: 'const label: string = `text`;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'label' } }],
		},
		{
			// eslint-disable-next-line no-template-curly-in-string -- fixture source contains a template placeholder
			code: 'const label = `text${name}`;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'label' } }],
		},
		{
			code: 'let label;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'label' } }],
		},
		{
			code: 'const run = getRun();',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'run' } }],
		},
		{
			code: 'const example = ExampleEnum;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'example' } }],
		},
		{
			code: 'const status = ExampleEnum.Success;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'status' } }],
		},
		{
			code: 'const sections = new Subject();',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'sections' } }],
		},
		{
			code: 'const sections = new Subject<SectionListDto[]>();',
			output: 'const sections: Subject<SectionListDto[]> = new Subject<SectionListDto[]>();',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'sections' } }],
		},
		{
			code: 'const messageClassMap = new Map<MessageStatus, string>();',
			output: 'const messageClassMap: Map<MessageStatus, string> = new Map<MessageStatus, string>();',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'messageClassMap' } }],
		},
		{
			code: 'const control = new forms.FormControl<string>("");',
			output: 'const control: forms.FormControl<string> = new forms.FormControl<string>("");',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'control' } }],
		},
		{
			code: 'const sections = new getSubject()<void>();',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'sections' } }],
		},
		{
			code: 'const input = target as HTMLInputElement;',
			output: 'const input: HTMLInputElement = target as HTMLInputElement;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'input' } }],
		},
		{
			code: 'const control = this.controls["title"] as FormControl<string>;',
			output: 'const control: FormControl<string> = this.controls["title"] as FormControl<string>;',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'control' } }],
		},
		{
			code: 'const record = value as const;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'record' } }],
		},
		{
			code: 'const { name } = user;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitType }],
		},
		{
			code: 'const [first] = items;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitType }],
		},
		{
			code: 'for (let index = 0; index < 10; index++) {}',
			output: 'for (let index: number = 0; index < 10; index++) {}',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'index' } }],
		},
		{
			code: 'class Box { value = 1; }',
			output: 'class Box { value: number = 1; }',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'value' } }],
		},
		{
			code: 'class Box { private readonly value = 1; }',
			output: 'class Box { private readonly value: number = 1; }',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'value' } }],
		},
		{
			code: 'class Box { accessor value = 1; }',
			output: 'class Box { accessor value: number = 1; }',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'value' } }],
		},
		{
			code: 'class Box { #value = 1; }',
			output: 'class Box { #value: number = 1; }',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: '#value' } }],
		},
		{
			code: 'class Box { scrolling = new Subject<void>(); }',
			output: 'class Box { scrolling: Subject<void> = new Subject<void>(); }',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'scrolling' } }],
		},
		{
			code: `class Box { ['value'] = 1; }`,
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitType }],
		},
		{
			code: 'function run(count): void {}',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: `function run(count = 1, label = 'text'): void {}`,
			output: `function run(count: number = 1, label: string = 'text'): void {}`,
			errors: [
				{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } },
				{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'label' } },
			],
		},
		{
			code: 'const run = (count = 1): void => {};',
			output: 'const run = (count: number = 1): void => {};',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: 'class Box { run(count): void {} }',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: 'class Box { constructor(private count = 1) {} }',
			output: 'class Box { constructor(private count: number = 1) {} }',
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
		{
			code: 'function run({ name }): void {}',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitType }],
		},
		{
			code: 'interface User { name; }',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'name' } }],
		},
		{
			code: 'interface User { [key: string]; }',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitType }],
		},
		{
			code: 'type Run = (count) => void;',
			output: null,
			errors: [{ messageId: MessageIdentifiers.MissingExplicitTypeNamed, data: { name: 'count' } }],
		},
	],
});

const directory: string = fs.mkdtempSync(path.join(os.tmpdir(), 'explicit-type-'));

try {
	const enumValuePath: string = path.join(directory, 'enum-value.ts');

	const enumValueSource: string = [
		`import { ExampleEnum } from './example-enum';`,
		'',
		'export const example = ExampleEnum;',
		'export const member = ExampleEnum.A;',
		'export const other = getValue();',
		'',
		'export class Box {',
		'\treadonly example = ExampleEnum;',
		'}',
		'',
	].join('\n');

	const classValuePath: string = path.join(directory, 'class-value.ts');

	const classValueSource: string = [
		`import { CreatePostForm, Subject } from './create-post-form';`,
		'',
		'export const testEslint = new CreatePostForm();',
		'export const sections = new Subject();',
		'export const named = new Subject<string>();',
		'',
	].join('\n');

	const linter: Linter = new Linter();

	const parserOptions: Linter.ParserOptions = {
		ecmaVersion: 2022,
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: directory,
	};

	fs.writeFileSync(
		path.join(directory, 'tsconfig.json'),
		`{
	"compilerOptions": {
		"strict": true,
		"target": "ES2022",
		"module": "ES2022",
		"moduleResolution": "bundler",
		"noEmit": true
	},
	"files": ["example-enum.ts", "enum-value.ts", "create-post-form.ts", "class-value.ts"]
}
`
	);

	fs.writeFileSync(path.join(directory, 'example-enum.ts'), `export enum ExampleEnum {\n\tA = 'a'\n}\n`);
	fs.writeFileSync(enumValuePath, enumValueSource);

	fs.writeFileSync(
		path.join(directory, 'create-post-form.ts'),
		[
			'class FormGroup<TControl = any> {}',
			'',
			'export class CreatePostForm extends FormGroup {}',
			'',
			'export class Subject<TValue> {}',
			'',
		].join('\n')
	);

	fs.writeFileSync(classValuePath, classValueSource);
	linter.defineParser('@typescript-eslint/parser', typescriptEslintParser);
	linter.defineRule('explicit-type', rule);

	const fixedEnumValue: Linter.FixReport = linter.verifyAndFix(
		enumValueSource,
		{
			parser: '@typescript-eslint/parser',
			parserOptions,
			rules: {
				// eslint-disable-next-line @typescript-eslint/naming-convention -- ESLint rule id
				'explicit-type': 'error',
			},
		},
		{ filename: enumValuePath }
	);

	equal(
		fixedEnumValue.output,
		[
			`import { ExampleEnum } from './example-enum';`,
			'',
			'export const example: typeof ExampleEnum = ExampleEnum;',
			'export const member = ExampleEnum.A;',
			'export const other = getValue();',
			'',
			'export class Box {',
			'\treadonly example: typeof ExampleEnum = ExampleEnum;',
			'}',
			'',
		].join('\n')
	);

	const fixedClassValue: Linter.FixReport = linter.verifyAndFix(
		classValueSource,
		{
			parser: '@typescript-eslint/parser',
			parserOptions,
			rules: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				'explicit-type': 'error',
			},
		},
		{ filename: classValuePath }
	);

	equal(
		fixedClassValue.output,
		[
			`import { CreatePostForm, Subject } from './create-post-form';`,
			'',
			'export const testEslint: CreatePostForm = new CreatePostForm();',
			'export const sections = new Subject();',
			'export const named: Subject<string> = new Subject<string>();',
			'',
		].join('\n')
	);
} finally {
	fs.rmSync(directory, { recursive: true, force: true });
}
