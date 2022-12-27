export function getResponse(httpError: any) {
  return JSON.parse(httpError.response);
}
