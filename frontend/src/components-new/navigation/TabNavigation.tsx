import React from 'react';
import { Icon } from '../ui/Icon';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: 'tabs' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  vertical?: boolean;
}

/**
 * Tab-Navigation-Komponente
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'tabs',
  size = 'md',
  fullWidth = false,
  vertical = false
}) => {
  const variantClass = variant === 'pills' ? 'nav-pills' : 'nav-tabs';
  const sizeClass = size === 'sm' ? 'small' : size === 'lg' ? 'fs-5' : '';
  const fullWidthClass = fullWidth ? 'nav-fill' : '';
  const verticalClass = vertical ? 'flex-column' : '';
  
  const navClasses = [
    'nav',
    variantClass,
    sizeClass,
    fullWidthClass,
    verticalClass,
    className
  ].filter(Boolean).join(' ');

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div>
      <ul className={navClasses} role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tab-${tab.id}`}
            >
              {tab.icon && <Icon name={tab.icon as any} className="me-2" />}
              {tab.label}
              {tab.badge && (
                <span className="badge bg-primary ms-2">
                  {tab.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      
      <div className="tab-content mt-3">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
            id={`tab-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation; 