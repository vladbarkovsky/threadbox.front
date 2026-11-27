import type { FileParameter } from './api-client';

export function convertToNSwagClientFileParameter(file: File): FileParameter {
	const fileParameter: FileParameter = {
		data: file,
		fileName: file.name,
	};

	return fileParameter;
}
