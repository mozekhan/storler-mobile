import { useState, useCallback, useMemo } from 'react';

export function useFilter(initialFilters = {}, options = {}) {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState({});

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));

    if (value !== undefined && value !== null && value !== '') {
      setActiveFilters(prev => ({
        ...prev,
        [key]: value,
      }));
    } else {
      setActiveFilters(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setActiveFilters({});
  }, [initialFilters]);

  const resetFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: initialFilters[key] !== undefined ? initialFilters[key] : '',
    }));
    setActiveFilters(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0;
  }, [activeFilters]);

  const getFilterParams = useCallback(() => {
    const params = {};
    Object.keys(activeFilters).forEach(key => {
      if (activeFilters[key] !== undefined && activeFilters[key] !== null && activeFilters[key] !== '') {
        params[key] = activeFilters[key];
      }
    });
    return params;
  }, [activeFilters]);

  return {
    filters,
    activeFilters,
    updateFilter,
    resetFilters,
    resetFilter,
    hasActiveFilters,
    getFilterParams,
  };
}

export default useFilter;