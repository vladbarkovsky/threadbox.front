import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import {
	canInsertTypeAnnotation,
	hasTypeAnnotation,
	isForInOrForOfBinding,
	isFunctionValue,
	isOptional,
	readName,
	readParameterInitializer,
	readTypedBinding,
} from './binding.js';
import { MessageIdentifiers } from './message-identifiers.enum.js';
import { readExplicitTypeText, readPrimitiveTypeName } from './syntactic-type-text.js';
import { readConstructedClassTypeText, readEnumTypeText } from './type-aware-type-text.js';

const createRule: typeof ESLintUtils.RuleCreator.withoutDocs = ESLintUtils.RuleCreator.withoutDocs;

function readFixTypeText(node: TSESTree.Node | null | undefined, sourceCode: TSESLint.SourceCode): string | undefined {
	return (
		readPrimitiveTypeName(node) ??
		readExplicitTypeText(node, sourceCode) ??
		readEnumTypeText(node, sourceCode) ??
		readConstructedClassTypeText(node, sourceCode)
	);
}

export = createRule<[], MessageIdentifiers>({
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Require an explicit type on a variable, field, property, or parameter, unless a variable or field is initialized with a function.',
		},
		messages: {
			[MessageIdentifiers.MissingExplicitType]: 'Expected an explicit type.',
			[MessageIdentifiers.MissingExplicitTypeNamed]: 'Expected {{name}} to have an explicit type.',
		},
		fixable: 'code',
		schema: [],
	},
	defaultOptions: [],
	create(context: Readonly<TSESLint.RuleContext<MessageIdentifiers, []>>): TSESLint.RuleListener {
		const sourceCode: TSESLint.SourceCode = context.sourceCode;

		function reportMissingExplicitType(binding: TSESTree.Node, typeText: string | undefined, allowFix: boolean): void {
			const name: string | undefined = readName(binding);
			const annotation: string | undefined = allowFix ? typeText : undefined;

			function insertType(fixer: TSESLint.RuleFixer): TSESLint.RuleFix {
				return fixer.insertTextAfter(binding, `: ${annotation}`);
			}

			if (annotation !== undefined) {
				if (name !== undefined) {
					context.report({
						node: binding,
						messageId: MessageIdentifiers.MissingExplicitTypeNamed,
						data: { name },
						fix: insertType,
					});

					return;
				}

				context.report({
					node: binding,
					messageId: MessageIdentifiers.MissingExplicitType,
					fix: insertType,
				});

				return;
			}

			if (name !== undefined) {
				context.report({
					node: binding,
					messageId: MessageIdentifiers.MissingExplicitTypeNamed,
					data: { name },
				});

				return;
			}

			context.report({
				node: binding,
				messageId: MessageIdentifiers.MissingExplicitType,
			});
		}

		function checkParameters(parameters: readonly TSESTree.Parameter[]): void {
			for (const parameter of parameters) {
				const binding: TSESTree.Node = readTypedBinding(parameter);

				if (hasTypeAnnotation(binding)) {
					continue;
				}

				reportMissingExplicitType(
					binding,
					readFixTypeText(readParameterInitializer(parameter), sourceCode),
					canInsertTypeAnnotation(binding, isOptional(binding))
				);
			}
		}

		return {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			VariableDeclarator(node: TSESTree.VariableDeclarator): void {
				if (
					node.id.typeAnnotation !== undefined ||
					isForInOrForOfBinding(node) ||
					(node.init !== null && isFunctionValue(node.init))
				) {
					return;
				}

				reportMissingExplicitType(node.id, readFixTypeText(node.init, sourceCode), canInsertTypeAnnotation(node.id, false));
			},
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'PropertyDefinition, AccessorProperty'(node: TSESTree.PropertyDefinition | TSESTree.AccessorProperty): void {
				if (node.typeAnnotation !== undefined || (node.value !== null && isFunctionValue(node.value))) {
					return;
				}

				reportMissingExplicitType(
					node.key,
					readFixTypeText(node.value, sourceCode),
					canInsertTypeAnnotation(node.key, node.computed || node.definite || node.optional)
				);
			},
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSEmptyBodyFunctionExpression, TSDeclareFunction, TSFunctionType, TSCallSignatureDeclaration, TSConstructSignatureDeclaration, TSMethodSignature, TSConstructorType'(
				node:
					| TSESTree.FunctionDeclaration
					| TSESTree.FunctionExpression
					| TSESTree.ArrowFunctionExpression
					| TSESTree.TSEmptyBodyFunctionExpression
					| TSESTree.TSDeclareFunction
					| TSESTree.TSFunctionType
					| TSESTree.TSCallSignatureDeclaration
					| TSESTree.TSConstructSignatureDeclaration
					| TSESTree.TSMethodSignature
					| TSESTree.TSConstructorType
			): void {
				checkParameters(node.params);
			},
			// eslint-disable-next-line @typescript-eslint/naming-convention
			TSPropertySignature(node: TSESTree.TSPropertySignature): void {
				if (node.typeAnnotation !== undefined) {
					return;
				}

				reportMissingExplicitType(node.key, undefined, false);
			},
			// eslint-disable-next-line @typescript-eslint/naming-convention
			TSIndexSignature(node: TSESTree.TSIndexSignature): void {
				checkParameters(node.parameters);

				if (node.typeAnnotation !== undefined) {
					return;
				}

				reportMissingExplicitType(node, undefined, false);
			},
		};
	},
});
