import type { ParserServices, ParserServicesWithTypeInformation } from '@typescript-eslint/typescript-estree';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import * as typescript from 'typescript';
import { isTypeName } from './syntactic-type-text.js';

function resolveAlias(typeChecker: typescript.TypeChecker, symbol: typescript.Symbol | undefined): typescript.Symbol | undefined {
	if (symbol === undefined) {
		return undefined;
	}

	if ((symbol.flags & typescript.SymbolFlags.Alias) === 0) {
		return symbol;
	}

	return typeChecker.getAliasedSymbol(symbol);
}

function readTypeAwareParserServices(
	parserServices: Partial<ParserServices> | undefined
): ParserServicesWithTypeInformation | undefined {
	if (parserServices === undefined) {
		return undefined;
	}

	if (
		parserServices.program === null ||
		parserServices.program === undefined ||
		parserServices.esTreeNodeToTSNodeMap === undefined ||
		parserServices.tsNodeToESTreeNodeMap === undefined
	) {
		return undefined;
	}

	return parserServices as ParserServicesWithTypeInformation;
}

function isReferenceType(type: typescript.Type): type is typescript.TypeReference {
	return (
		(type.flags & typescript.TypeFlags.Object) !== 0 &&
		((type as typescript.ObjectType).objectFlags & typescript.ObjectFlags.Reference) !== 0
	);
}

function readTypeArguments(typeChecker: typescript.TypeChecker, type: typescript.Type): readonly typescript.Type[] {
	if (!isReferenceType(type)) {
		return [];
	}

	return typeChecker.getTypeArguments(type);
}

export function readEnumTypeText(node: TSESTree.Node | null | undefined, sourceCode: TSESLint.SourceCode): string | undefined {
	const parserServices: ParserServicesWithTypeInformation | undefined = readTypeAwareParserServices(sourceCode.parserServices);

	if (node === null || node === undefined || !isTypeName(node) || parserServices === undefined) {
		return undefined;
	}

	const typeChecker: typescript.TypeChecker = parserServices.program.getTypeChecker();

	const symbol: typescript.Symbol | undefined = resolveAlias(
		typeChecker,
		typeChecker.getSymbolAtLocation(parserServices.esTreeNodeToTSNodeMap.get(node))
	);

	if (symbol === undefined || (symbol.flags & typescript.SymbolFlags.Enum) === 0) {
		return undefined;
	}

	return `typeof ${sourceCode.getText(node)}`;
}

export function readConstructedClassTypeText(
	node: TSESTree.Node | null | undefined,
	sourceCode: TSESLint.SourceCode
): string | undefined {
	const parserServices: ParserServicesWithTypeInformation | undefined = readTypeAwareParserServices(sourceCode.parserServices);

	if (
		node === null ||
		node === undefined ||
		node.type !== AST_NODE_TYPES.NewExpression ||
		node.typeArguments !== undefined ||
		!isTypeName(node.callee) ||
		parserServices === undefined
	) {
		return undefined;
	}

	const typeChecker: typescript.TypeChecker = parserServices.program.getTypeChecker();
	const type: typescript.Type = typeChecker.getTypeAtLocation(parserServices.esTreeNodeToTSNodeMap.get(node));
	const instanceSymbol: typescript.Symbol | undefined = type.symbol;

	if ((instanceSymbol.flags & typescript.SymbolFlags.Class) === 0 || readTypeArguments(typeChecker, type).length > 0) {
		return undefined;
	}

	const calleeSymbol: typescript.Symbol | undefined = resolveAlias(
		typeChecker,
		typeChecker.getSymbolAtLocation(parserServices.esTreeNodeToTSNodeMap.get(node.callee))
	);

	if (calleeSymbol !== instanceSymbol) {
		return undefined;
	}

	return sourceCode.getText(node.callee);
}
