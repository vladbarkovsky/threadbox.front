import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export function isFunctionValue(node: TSESTree.Node): node is TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression {
	return node.type === AST_NODE_TYPES.ArrowFunctionExpression || node.type === AST_NODE_TYPES.FunctionExpression;
}

export function isForInOrForOfBinding(declarator: TSESTree.VariableDeclarator): boolean {
	const declaration: TSESTree.Node = declarator.parent;

	if (declaration.type !== AST_NODE_TYPES.VariableDeclaration) {
		return false;
	}

	const statement: TSESTree.Node = declaration.parent;
	return statement.type === AST_NODE_TYPES.ForInStatement || statement.type === AST_NODE_TYPES.ForOfStatement;
}

export function readName(node: TSESTree.Node): string | undefined {
	if (node.type === AST_NODE_TYPES.PrivateIdentifier) {
		return '#' + node.name;
	}

	if (node.type === AST_NODE_TYPES.Identifier) {
		return node.name;
	}

	return undefined;
}

export function canInsertTypeAnnotation(binding: TSESTree.Node, isBlocked: boolean): boolean {
	if (isBlocked) {
		return false;
	}

	return binding.type === AST_NODE_TYPES.Identifier || binding.type === AST_NODE_TYPES.PrivateIdentifier;
}

export function readTypedBinding(parameter: TSESTree.Parameter): TSESTree.Node {
	if (parameter.type === AST_NODE_TYPES.TSParameterProperty) {
		return readTypedBinding(parameter.parameter);
	}

	if (parameter.type === AST_NODE_TYPES.AssignmentPattern) {
		if (parameter.typeAnnotation !== undefined) {
			return parameter;
		}

		return parameter.left;
	}

	if (parameter.type === AST_NODE_TYPES.RestElement && parameter.typeAnnotation === undefined) {
		return parameter.argument;
	}

	return parameter;
}

export function readParameterInitializer(parameter: TSESTree.Parameter): TSESTree.Node | undefined {
	if (parameter.type === AST_NODE_TYPES.AssignmentPattern) {
		return parameter.right;
	}

	if (parameter.type === AST_NODE_TYPES.TSParameterProperty) {
		return readParameterInitializer(parameter.parameter);
	}

	return undefined;
}

export function hasTypeAnnotation(node: TSESTree.Node): boolean {
	return 'typeAnnotation' in node && node.typeAnnotation !== undefined;
}

export function isOptional(node: TSESTree.Node): boolean {
	return 'optional' in node && node.optional === true;
}
