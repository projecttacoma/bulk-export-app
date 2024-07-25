import { SupportedExportTypes } from '@/components/query-selector/export-type';
import { TypeElement } from '@/state/type-element-params-state';

/*
 * Parameters to build export request string.
 */
export interface BuilderRequest {
  baseUrl: string;
  exportType: SupportedExportTypes;
  id?: string;
  queryParams: BuilderRequestQueryParams;
}

/*
 * Query parameters that modify the export request.
 */
export interface BuilderRequestQueryParams {
  type: string[];
  element: string[];
  typeElement: TypeElement[];
  typeFilter: string[];
}

/*
 * Builds bulk export request string from a list of parameters, a SupportedExportType, and an id.
 * Note: currently only supports type parameters and elements.
 */
export function buildExportRequestString(request: BuilderRequest) {
  const { baseUrl, exportType, id, queryParams } = request;

  const exportPath = buildExportPath(exportType, id);

  const queryString = buildQueryString(queryParams);

  return baseUrl + exportPath + queryString;
}

/*
 * Builds the export path based on type of export
 */
function buildExportPath(exportType: SupportedExportTypes, id?: string) {
  if (exportType === 'system') return '/$export';
  else if (exportType === 'patient') return '/Patient/$export';
  else if (exportType === 'group') return `/Group/${id}/$export`;
}

/*
 * Builds the query string for the request
 */
function buildQueryString(queryParams: BuilderRequestQueryParams) {
  if (!hasQueryParams(queryParams)) return '';

  const paramsArray: string[] = [];

  if (hasTypeParams(queryParams)) paramsArray.push(`_type=${queryParams.type.toString()}`);
  if (hasSomeElementParams(queryParams))
    paramsArray.push(buildElementsQueryString(queryParams.typeElement, queryParams.element));
  if (hasTypeFilterParams(queryParams)) paramsArray.push(buildTypeFilterQueryString(queryParams.typeFilter));

  return '?' + paramsArray.join('&');
}

/*
 * Builds the "_elements" parameter part of query string
 */
function buildElementsQueryString(typeElements: TypeElement[], elements: string[]) {
  const paramsArray: string[] = typeElements.map(typeElement => typeElementToString(typeElement)).concat(elements);

  return '_elements=' + paramsArray.toString();
}

/*
 * Builds the "_typeFilter" parameter part of query string
 */
function buildTypeFilterQueryString(typeFilters: string[]) {
  return `_typeFilter=${typeFilters.toString()}`;
}

/*
 * Converts an object of type TypeElements to a string
 */
function typeElementToString(typeElement: TypeElement) {
  return typeElement.elements.map(element => `${typeElement.type}.${element}`).toString();
}

/*
 * Checks if incoming request has query parameters
 */
function hasQueryParams(params: BuilderRequestQueryParams) {
  return hasTypeParams(params) || hasSomeElementParams(params) || hasTypeFilterParams(params);
}

/*
 * Checks if incoming request has "_type" query parameters
 */
function hasTypeParams(params: BuilderRequestQueryParams) {
  return params.type.length !== 0;
}

/*
 * Checks if incoming request has "_elements" query parameters
 */
function hasSomeElementParams(params: BuilderRequestQueryParams) {
  return params.typeElement.length !== 0 || params.element.length !== 0;
}

function hasTypeFilterParams(params: BuilderRequestQueryParams) {
  return params.typeFilter.length !== 0;
}
