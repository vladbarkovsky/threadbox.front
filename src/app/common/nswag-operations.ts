import { FileParameter, SwaggerException } from '../../../api-client';

export function convertToNSwagFileParameter(file: File) {
  return <FileParameter>{
    data: file,
    fileName: file.name,
  };
}

export function getResponseBody(error: any): string {
  return (error as SwaggerException).response;
}
