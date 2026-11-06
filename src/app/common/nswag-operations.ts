import type { ApiException, FileParameter } from '../../../api-client';

export function convertToNSwagClientFileParameter(file: File): FileParameter {
	const fileParameter: FileParameter = {
		data: file,
		fileName: file.name,
	};

	return fileParameter;
}

export function getResponseBody(error: unknown): string {
	return (error as ApiException).response;
}
