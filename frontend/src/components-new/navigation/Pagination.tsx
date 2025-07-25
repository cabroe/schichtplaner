import React from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
}

/**
 * Pagination-Komponente
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  size = 'md',
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  disabled = false
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (!disabled && page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageButton = (page: number, isActive = false) => (
    <li key={page} className="page-item">
      <Button
        variant={isActive ? 'primary' : 'outline-secondary'}
        size={size}
        onClick={() => handlePageClick(page)}
        disabled={disabled}
        className="page-link"
      >
        {page}
      </Button>
    </li>
  );

  const renderNavigationButton = (
    page: number,
    icon: string,
    label: string,
    disabled: boolean
  ) => (
    <li className="page-item">
      <Button
        variant="outline-secondary"
        size={size}
        onClick={() => handlePageClick(page)}
        disabled={disabled || disabled}
        className="page-link"
        icon={<Icon name={icon as any} />}
        title={label}
      >
        <span className="visually-hidden">{label}</span>
      </Button>
    </li>
  );

  return (
    <nav aria-label="Seitennavigation" className={className}>
      <ul className="pagination justify-content-center mb-0">
        {showFirstLast && (
          renderNavigationButton(
            1,
            'chevrons-left',
            'Erste Seite',
            currentPage === 1
          )
        )}
        
        {showPrevNext && (
          renderNavigationButton(
            currentPage - 1,
            'chevron-left',
            'Vorherige Seite',
            currentPage === 1
          )
        )}
        
        {visiblePages.map(page => renderPageButton(page, page === currentPage))}
        
        {showPrevNext && (
          renderNavigationButton(
            currentPage + 1,
            'chevron-right',
            'Nächste Seite',
            currentPage === totalPages
          )
        )}
        
        {showFirstLast && (
          renderNavigationButton(
            totalPages,
            'chevrons-right',
            'Letzte Seite',
            currentPage === totalPages
          )
        )}
      </ul>
      
      <div className="text-center mt-2">
        <small className="text-muted">
          Seite {currentPage} von {totalPages}
        </small>
      </div>
    </nav>
  );
};

export default Pagination; 