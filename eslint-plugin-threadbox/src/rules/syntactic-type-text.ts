import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export function isTypeName(node: TSESTree.Node): node is TSESTree.Identifier | TSESTree.MemberExpression {
	if (node.type === AST_NODE_TYPES.Identifier) {
		return true;
	}

	return (
		node.type === AST_NODE_TYPES.MemberExpression &&
		!node.computed &&
		!node.optional &&
		node.property.type === AST_NODE_TYPES.Identifier &&
		isTypeName(node.object)
	);
}

function readLiteralTypeName(literal: TSESTree.Literal): string | undefined {
	if ('regex' in literal) {
		return undefined;
	}

	if ('bigint' in literal) {
		return 'bigint';
	}

	switch (typeof literal.value) {
		case 'string':
			return 'string';
		case 'number':
			return 'number';
		case 'boolean':
			return 'boolean';
		default:
			return undefined;
	}
}

function readUnaryPrimitiveTypeName(unaryExpression: TSESTree.UnaryExpression): string | undefined {
	if (unaryExpression.operator !== '+' && unaryExpression.operator !== '-') {
		return undefined;
	}

	const operandTypeName: string | undefined = readPrimitiveTypeName(unaryExpression.argument);

	if (operandTypeName === 'number' || operandTypeName === 'bigint') {
		return operandTypeName;
	}

	return undefined;
}

export function readPrimitiveTypeName(node: TSESTree.Node | null | undefined): string | undefined {
	if (node === null || node === undefined) {
		return undefined;
	}

	if (node.type === AST_NODE_TYPES.Literal) {
		return readLiteralTypeName(node);
	}

	if (node.type === AST_NODE_TYPES.TemplateLiteral && node.expressions.length === 0) {
		return 'string';
	}

	if (node.type === AST_NODE_TYPES.UnaryExpression) {
		return readUnaryPrimitiveTypeName(node);
	}

	return undefined;
}

function isConstAssertion(typeNode: TSESTree.TypeNode): boolean {
	return (
		typeNode.type === AST_NODE_TYPES.TSTypeReference &&
		typeNode.typeName.type === AST_NODE_TYPES.Identifier &&
		typeNode.typeName.name === 'const'
	);
}

export function readExplicitTypeText(
	node: TSESTree.Node | null | undefined,
	sourceCode: TSESLint.SourceCode
): string | undefined {
	if (node === null || node === undefined) {
		return undefined;
	}

	if (node.type === AST_NODE_TYPES.NewExpression) {
		const typeArguments: TSESTree.TSTypeParameterInstantiation | undefined = node.typeArguments;

		if (typeArguments === undefined || typeArguments.params.length === 0 || !isTypeName(node.callee)) {
			return undefined;
		}

		return `${sourceCode.getText(node.callee)}${sourceCode.getText(typeArguments)}`;
	}

	if (node.type === AST_NODE_TYPES.TSAsExpression && !isConstAssertion(node.typeAnnotation)) {
		return sourceCode.getText(node.typeAnnotation);
	}

	return undefined;
}
