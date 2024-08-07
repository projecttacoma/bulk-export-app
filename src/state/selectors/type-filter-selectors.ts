import { selector } from 'recoil';
import { typeFilterParamsState } from '../type-filter-params-state';

/*
 * Recoil selector to get just the active type filters
 */
export const activeTypeFiltersState = selector({
  key: 'activeTypeFiltersState',
  get: ({ get }) => get(typeFilterParamsState).filter(typeFilter => typeFilter.active)
});

/*
 * Recoil selector to get just the inactive type filters
 */
export const inactiveTypeFiltersState = selector({
  key: 'inactiveTypeFiltersState',
  get: ({ get }) => get(typeFilterParamsState).filter(typeFilter => !typeFilter.active)
});
