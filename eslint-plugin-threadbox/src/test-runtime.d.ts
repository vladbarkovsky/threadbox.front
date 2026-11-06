declare const __filename: string;

declare module 'fs' {
	export function mkdtempSync(prefix: string): string;
	export function writeFileSync(filePath: string, data: string): void;
	export function rmSync(filePath: string, options: { recursive: boolean; force: boolean }): void;
}

declare module 'os' {
	export function tmpdir(): string;
}

declare module 'path' {
	export function join(...paths: string[]): string;
}

declare module 'module' {
	interface NodeRequire {
		(moduleName: string): unknown;
		resolve(moduleName: string): string;
	}

	export function createRequire(filename: string): NodeRequire;
}

declare module 'node:assert/strict' {
	export function equal(actual: unknown, expected: unknown): void;
}
