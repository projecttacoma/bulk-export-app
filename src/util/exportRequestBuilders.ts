import { SupportedExportTypes } from '@/components/query-selector/export-type';

/**
 * Parameters to build export request string. Will need to add more fields in the future
 * for element parameters and type filter parameters.
 */
export interface BuilderRequest {
  exportType: SupportedExportTypes;
  id: string | null;
  typeParams: string[];
  elementParams?: string[]; // may not be string[] in the future
  typeFilterParams?: string[]; // may not be string[] in the future
}

/**
 * Builds bulk export request string from a list of parameters, a SupportedExportType, and an id.
 * Note: currently only supports type parameters.
 */
export function buildExportRequestString(request: BuilderRequest) {
  const { exportType, id, typeParams } = request;
  const baseUrl = `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}`;
  const queryString = typeParams.length === 0 ? '' : `?_type=${typeParams.toString()}`;

  let path = '';

  if (exportType === 'system') {
    path = '/$export';
  } else if (exportType === 'patient') {
    path = '/Patient/$export';
  } else if (exportType === 'group') {
    path = `/Group/${id}/$export`;
  }
  return baseUrl + path + queryString;
}
