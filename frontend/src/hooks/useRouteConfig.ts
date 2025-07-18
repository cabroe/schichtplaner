import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteByPath, isProtectedRoute, type RouteDefinition } from '../routes/routeDefinitions';

export function useRouteConfig() {
  const location = useLocation();
  const { pathname } = location;
  
  const currentRoute = useMemo((): RouteDefinition | undefined => {
    return getRouteByPath(pathname);
  }, [pathname]);
  
  const isProtected = useMemo((): boolean => {
    return isProtectedRoute(pathname);
  }, [pathname]);
  
  const currentTitle = useMemo((): string => {
    return currentRoute?.title || '';
  }, [currentRoute]);
  
  const currentTemplate = useMemo((): 'main' | 'simple' | undefined => {
    return currentRoute?.template;
  }, [currentRoute]);
  
  return {
    currentRoute,
    isProtected,
    currentTitle,
    currentTemplate,
    pathname
  };
} 