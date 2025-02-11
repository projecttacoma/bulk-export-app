import { SupportedExportTypes } from '@/components/query-selector/export-type';
import { TypeElement } from '@/state/type-element-params-state';
import { TypeFilter } from '@/state/type-filter-params-state';

/*
 * Parameters to build export request string.
 */
export interface BuilderRequest {
  baseUrl: string;
  exportType: SupportedExportTypes;
  queryParams: BuilderRequestQueryParams;
  id?: string;
}

/*
 * Query parameters that modify the export request.
 */
export interface BuilderRequestQueryParams {
  type: string[];
  element: string[];
  typeElement: TypeElement[];
  typeFilter: TypeFilter[];
  organizeOutputByPatient: boolean;
}

/*
 * Builds bulk export request string from a list of parameters, a SupportedExportType, and an id.
 * Note: currently only supports type parameters and elements.
 */
export function buildExportRequestString(request: BuilderRequest) {
  const { baseUrl, exportType, id, queryParams } = request;
  const exportPath = buildExportPath(exportType, id);
  const queryString = buildQueryString(queryParams) ?? '';

  return baseUrl + exportPath + queryString;
}

/*
 * Builds the export path based on type of export
 */
function buildExportPath(exportType: SupportedExportTypes, id?: string) {
  if (exportType === 'system') return '/$export';
  else if (exportType === 'patient') return '/Patient/$export';
  else if (exportType === 'group') return `/Group/${id}/$export`;
  else if (exportType === 'measure-bundle') return `/MeasureBundle/${id}/$export`;
}

/*
 * Builds the query string for the request
 */
function buildQueryString(queryParams: BuilderRequestQueryParams) {
  const paramsArray: string[] = [];

  if (queryParams.type.length !== 0) paramsArray.push(`_type=${queryParams.type.toString()}`);
  if (queryParams.typeElement.length !== 0 || queryParams.element.length !== 0) {
    const typeElementStringArray = queryParams.typeElement.map(typeElement =>
      typeElement.elements.map(element => `${typeElement.type}.${element}`).toString()
    );
    const combinedElementStringArray = typeElementStringArray.concat(queryParams.element);

    paramsArray.push('_elements=' + combinedElementStringArray.toString());
  }
  if (queryParams.typeFilter.length !== 0) {
    paramsArray.push(
      `_typeFilter=${queryParams.typeFilter.map(typeFilter => encodeURIComponent(typeFilter.filter)).toString()}`
    );
  }

  if (queryParams.organizeOutputByPatient === true) {
    paramsArray.push(`organizeOutputBy=Patient`);
  }

  if (paramsArray.length === 0) return;

  return '?' + paramsArray.join('&');
}
